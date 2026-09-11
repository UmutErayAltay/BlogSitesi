import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
  };

  const handleShare = (platform: string) => {
    window.open(shareLinks[platform as keyof typeof shareLinks], '_blank');
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title="Facebook'ta Paylaş">
        <IconButton onClick={() => handleShare('facebook')} color="primary">
          <FacebookIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Twitter'da Paylaş">
        <IconButton onClick={() => handleShare('twitter')} color="primary">
          <TwitterIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="LinkedIn'de Paylaş">
        <IconButton onClick={() => handleShare('linkedin')} color="primary">
          <LinkedInIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="WhatsApp'ta Paylaş">
        <IconButton onClick={() => handleShare('whatsapp')} color="primary">
          <WhatsAppIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ShareButtons; 