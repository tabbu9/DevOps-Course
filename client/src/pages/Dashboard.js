import React, { useEffect, useState } from 'react';
import {
  Box, SimpleGrid, Heading, Text, Button, useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDocker, FaAws, FaCubes, FaServer, FaCogs } from 'react-icons/fa';

const icons = {
  docker: FaDocker,
  kubernetes: FaCubes,
  aws: FaAws,
  sonarqube: FaServer,
  jenkins: FaCogs
};

const MotionButton = motion(Button);

const Dashboard = ({ user }) => {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetch('/api/courses/topics')
      .then(res => res.json())
      .then(setTopics);
  }, []);

  return (
    <Box maxW="6xl" mx="auto" mt={8} p={4}>
      <Heading mb={8} color="teal.700" textAlign="center" fontWeight="bold">
        Welcome {user.name}, Explore DevOps Courses!
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={8}>
        {topics.map(t => {
          const Icon = icons[t.key] || FaCogs;
          return (
            <Box
              key={t.key}
              bg="white"
              borderRadius="lg"
              boxShadow="xl"
              p={8}
              textAlign="center"
              transition="transform 0.2s"
              _hover={{ transform: "scale(1.04)", boxShadow: "2xl" }}
            >
              <Icon size={48} color="#319795" style={{ marginBottom: 16 }} />
              <Heading size="md" mb={2}>{t.label}</Heading>
              <Text mb={4}>Learn {t.label} from basics to advanced with interactive subtopics.</Text>
              <MotionButton
                colorScheme="teal"
                size="lg"
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(`/topics/${t.key}`)}
                _hover={{ bg: "teal.600", boxShadow: "lg", transform: "scale(1.06)" }}
                transition="all 0.2s"
              >
                Explore {t.label}
              </MotionButton>
            </Box>
          )
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;