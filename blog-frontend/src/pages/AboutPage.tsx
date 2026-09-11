import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, TextField } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAppSelector } from '../hooks/redux';
import { getAbout, updateAbout, About } from '../services/aboutService';

const AboutPage: React.FC = () => {
  const [about, setAbout] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState('');
  const { user } = useAppSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const data = await getAbout();
      setAbout(data);
      setContent(data?.content || '');
    } catch (error) {
      console.error('Hakkında bilgisi yüklenirken hata:', error);
    }
  };

  const handleSave = async () => {
    try {
      const updated = await updateAbout(content);
      setAbout(updated);
      setEditing(false);
    } catch (error) {
      console.error('Hakkında bilgisi güncellenirken hata:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Hakkında
          </Typography>

          {isAdmin && !editing && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditing(true)}
              sx={{ mb: 2 }}
            >
              Düzenle
            </Button>
          )}

          {editing ? (
            <>
              <ReactQuill
                value={content}
                onChange={setContent}
                style={{ height: '300px', marginBottom: '50px' }}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Kaydet
                </Button>
                <Button variant="outlined" onClick={() => setEditing(false)}>
                  İptal
                </Button>
              </Box>
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: about?.content || '' }} />
          )}

          {about?.updatedBy && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: 'block' }}>
              Son güncelleme: {new Date(about.lastUpdated).toLocaleString()} - 
              Güncelleyen: {about.updatedBy.username}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default AboutPage; 