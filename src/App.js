import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
} from '@mantine/core';
import { MoonStars, Sun, Trash } from 'tabler-icons-react';
import {
  MantineProvider,
  ColorSchemeProvider,
} from '@mantine/core';
import { useColorScheme, useHotkeys, useLocalStorage } from '@mantine/hooks';
import './style.css';

export default function App() {
  const [courses, setCourses] = useState([]);
  const [opened, setOpened] = useState(false);

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  const courseTitle = useRef('');
  const courseSummary = useRef('');
  const courseItems = useRef('');

  function createCourse() {
    setCourses([
      ...courses,
      {
        title: courseTitle.current.value,
        summary: courseSummary.current.value,
        items: courseItems.current.value,
      },
    ]);

    saveCourses([
      ...courses,
      {
        title: courseTitle.current.value,
        summary: courseSummary.current.value,
        items: courseItems.current.value,
      },
    ]);
  }

  function deleteCourse(index) {
    const clonedCourses = [...courses];
    clonedCourses.splice(index, 1);
    setCourses(clonedCourses);
    saveCourses(clonedCourses);
  }

  function loadCourses() {
    const loadedCourses = localStorage.getItem('courses');
    const courses = JSON.parse(loadedCourses);
    if (courses) {
      setCourses(courses);
    }
  }

  function saveCourses(courses) {
    localStorage.setItem('courses', JSON.stringify(courses));
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme, defaultRadius: 'md' }} withGlobalStyles withNormalizeCSS>
        <div className="App">
          <Modal
            opened={opened}
            size={'md'}
            title={'New Course'}
            withCloseButton={false}
            onClose={() => {
              setOpened(false);
            }}
            centered
          >
            <TextInput mt={'md'} ref={courseTitle} placeholder={'Course Title'} required label={'Title'} />
            <TextInput ref={courseSummary} mt={'md'} placeholder={'Course Summary'} label={'Summary'} />
            <TextInput ref={courseItems} mt={'md'} placeholder={'Course Items'} label={'Items'} />
            <Group mt={'md'} position={'apart'}>
              <Button onClick={() => { setOpened(false); }} variant={'subtle'}>
                Cancel
              </Button>
              <Button onClick={() => { createCourse(); setOpened(false); }}>
                Add Course
              </Button>
            </Group>
          </Modal>
          <Container size={550} my={40}>
            <Group position={'apart'}>
              <Title sx={theme => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
                My Courses
              </Title>
              <ActionIcon color={'blue'} onClick={() => toggleColorScheme()} size='lg'>
                {colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
              </ActionIcon>
            </Group>
            {courses.length > 0 ? (
              courses.map((course, index) => (
                course.title && (
                  <Card withBorder key={index} mt={'sm'} className="Card">
                    <Group position={'apart'}>
                      <Text weight={'bold'}>{course.title}</Text>
                      <ActionIcon onClick={() => { deleteCourse(index); }} color={'red'} variant={'transparent'}>
                        <Trash />
                      </ActionIcon>
                    </Group>
                    <Text color={'dimmed'} size={'md'} mt={'sm'}>
                      {course.summary || 'No summary was provided for this course'}
                    </Text>
                    <Text color={'dimmed'} size={'md'} mt={'sm'}>
                      {course.items ? `Items in this course are: ${course.items}` : 'No items were provided for this course'}
                    </Text>
                  </Card>
                )
              ))
            ) : (
              <Text size={'lg'} mt={'md'} color={'dimmed'}>
                You have no courses in this set
              </Text>
            )}
            <Button onClick={() => { setOpened(true); }} fullWidth mt={'md'}>
              New Course
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
