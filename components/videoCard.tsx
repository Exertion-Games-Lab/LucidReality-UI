import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from '@ui-kitten/components';


interface VideoCardProps {
  title?: string;
  excerpt?: string;
  children?: React.ReactNode;
}


const VideoCard: React.FC<VideoCardProps> = ({ title, excerpt, children }) => {
  return (
    <Card style={styles.card}>
      {title && <Text category='h6' style={styles.title}>{title}</Text>}
      {excerpt && <Text category='p1' style={styles.excerpt}>{excerpt}</Text>}
      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 0, // Optionally remove the border if you want the card to be tight around the video
    marginBottom: -130,
  },
  title: {
    marginHorizontal: 16, // Horizontal padding for title text
    marginBottom: 8, // Space between title and excerpt
  },
  excerpt: {
    marginHorizontal: 16, // Horizontal padding for excerpt text
    marginBottom: 16, // Space between excerpt and video
  },
});

export default VideoCard;
