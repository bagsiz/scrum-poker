import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, query, onSnapshot, orderBy, updateDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { 
  Container, 
  Button, 
  Box, 
  Typography,
  Card,
  CardContent,
  Grid,
  ButtonGroup,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Chip
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isAdmin, POINTS } from '../config/firebase';

export default function TaskPoints() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState(null);
  const [votes, setVotes] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Listen for active users
    const usersRef = collection(db, 'activeUsers');
    const userDoc = doc(usersRef, currentUser.email);
    
    // Add current user to active users
    setDoc(userDoc, {
      email: currentUser.email,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      lastSeen: new Date().toISOString()
    }, { merge: true });

    // Remove user when they leave
    window.addEventListener('beforeunload', () => {
      deleteDoc(userDoc);
    });

    // Listen for active users changes
    const q1 = query(usersRef, orderBy('displayName'));
    const unsubscribeUsers = onSnapshot(q1, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setActiveUsers(users);
    });

    // Listen for current task
    const q2 = query(collection(db, 'activeTask'), orderBy('createdAt', 'desc'));
    const unsubscribeTask = onSnapshot(q2, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        setCurrentTask({ id: doc.id, ...data });
        setVotes(data.votes || {});
        setRevealed(data.revealed || false);
      });
    });

    return () => {
      unsubscribeUsers();
      unsubscribeTask();
      deleteDoc(userDoc);
    };
  }, [currentUser, navigate]);

  const handleVote = async (points) => {
    if (!currentTask || revealed) return;
    
    try {
      const taskRef = doc(db, 'activeTask', currentTask.id);
      const newVotes = {
        ...votes,
        [currentUser.email]: points
      };
      
      await updateDoc(taskRef, {
        votes: newVotes
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleReset = async () => {
    if (!currentTask) return;
    try {
      const taskRef = doc(db, 'activeTask', currentTask.id);
      await updateDoc(taskRef, {
        votes: {},
        revealed: false
      });
      setRevealed(false);
    } catch (error) {
      console.error('Error resetting votes:', error);
    }
  };

  const calculateAverage = () => {
    const voteValues = Object.values(votes).filter(value => typeof value === 'number');
    if (voteValues.length === 0) return 0;
    const sum = voteValues.reduce((a, b) => a + b, 0);
    return (sum / voteValues.length).toFixed(1);
  };

  const startNewVoting = async () => {
    try {
      await addDoc(collection(db, 'activeTask'), {
        createdAt: new Date().toISOString(),
        votes: {},
        revealed: false,
        createdBy: currentUser.email
      });
      setRevealed(false);
    } catch (error) {
      console.error('Error starting new session:', error);
    }
  };

  const handleReveal = async () => {
    if (!currentTask) return;
    try {
      const taskRef = doc(db, 'activeTask', currentTask.id);
      await updateDoc(taskRef, {
        revealed: true
      });
      setRevealed(true);
    } catch (error) {
      console.error('Error revealing votes:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isUserAdmin = currentUser ? isAdmin(currentUser.email) : false;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Scrum Planning Poker
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {currentUser?.displayName}
              {isUserAdmin && (
                <Chip
                  size="small"
                  label="Admin"
                  color="secondary"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <Avatar 
                src={currentUser?.photoURL} 
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          {isUserAdmin && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={startNewVoting}
                size="large"
              >
                Start New Session
              </Button>
              {currentTask && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleReset}
                  size="large"
                >
                  Reset Current Session
                </Button>
              )}
            </Box>
          )}

          {currentTask && (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Current Voting Session
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <ButtonGroup variant="contained" color="primary">
                    {POINTS.map((point) => (
                      <Button 
                        key={point}
                        onClick={() => handleVote(point)}
                        variant={votes[currentUser?.email] === point ? 'contained' : 'outlined'}
                        sx={{ 
                          minWidth: '48px',
                          bgcolor: votes[currentUser?.email] === point ? 'primary.main' : 'transparent'
                        }}
                        disabled={revealed}
                      >
                        {point}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Box>

                {isUserAdmin && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleReveal}
                      disabled={revealed || Object.keys(votes).length === 0}
                    >
                      Reveal Points
                    </Button>
                  </Box>
                )}

                <Box sx={{ mt: 3, mb: 3 }}>
                  <Typography variant="subtitle1" align="center" gutterBottom>
                    Participants
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                    {activeUsers.map((user) => (
                      <Chip
                        key={user.email}
                        avatar={<Avatar src={user.photoURL} />}
                        label={user.displayName.split(' ')[0]}
                        color={votes[user.email] ? "success" : "default"}
                        variant={votes[user.email] ? "filled" : "outlined"}
                      />
                    ))}
                  </Box>
                </Box>

                {revealed ? (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                          Average Points: {calculateAverage()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          {activeUsers.map((user) => (
                            <Box 
                              key={user.email} 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2 
                              }}
                            >
                              <Avatar src={user.photoURL} />
                              <Typography>
                                {user.displayName}: {votes[user.email] || 'No vote'}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                ) : null}
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
} 