import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api
      .get("/repositories")
      .then((response) => setRepositories(response.data))
      .catch((err) => console.error(err));
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`/repositories/${id}/like`);

    const oldRepoIndex = repositories.findIndex((repo) => repo.id === id);
    const newRepoList = [...repositories];

    newRepoList[oldRepoIndex] = response.data;

    setRepositories(newRepoList);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repo) => repo.id}
          listItem={({ item: repo }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repo.title}</Text>

              <View style={styles.techsContainer}>
                <FlatList
                  data={repo.techs}
                  keyExtractor={(item) =>
                    `${item} ${Math.random() * (100 - 1) + 1}`
                  }
                  listItem={({ item: singleTech }) => (
                    <Text style={styles.tech}>{singleTech}</Text>
                  )}
                />
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repo.id}`}
                >
                  {repo.likes}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repo.id)}
                testID={`like-button-${repo.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
