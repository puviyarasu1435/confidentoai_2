const express = require("express");
<<<<<<< HEAD
const { firestoreDb, realtimeDb } = require("./firebaseConfig");
const {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} = require("firebase/firestore");
const { getDatabase, ref, child, get, update } = require("firebase/database");

const GeminiAIRoutes = require("./routes/Gemini");
const path = require("path");
=======
const http = require("http");
const { Server } = require("socket.io");
const db = require("./firebaseConfig"); // Ensure this is correctly set up
const { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteField  } = require("firebase/firestore");
const path = require("path");
const GeminiAIRoutes = require("./routes/Gemini");

let ANIMATION_STATE = {STATE:"IDEL"}; 
let isChange = {check:""};
>>>>>>> 4bb6b67622a2b3f76871f248d7968be82c38967c

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/AI", GeminiAIRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get all documents from the "Environment" collection in Firestore
app.get("/environment", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firestoreDb, "Environment"));
    const environments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send(environments);
  } catch (error) {
    console.error("Error fetching documents: ", error);
    res.status(500).send({ error: error.message });
  }
});

// Get seats data based on the environment ID from Firestore
app.get("/environment/:id/seats", async (req, res) => {
  const { id } = req.params;
  try {
    const envDoc = await getDoc(doc(firestoreDb, "Environment", id));
    if (envDoc.exists()) {
      res.send(envDoc.data().Seats);
    } else {
      res.status(404).json({ error: "Environment not found" });
    }
  } catch (error) {
      res.status(500).json({ error: "Error fetching environment data" });
    }
});

app.get("/characters", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(firestoreDb, "Characters"));
    const characters = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send(characters);
  } catch (error) {
    console.error("Error fetching characters: ", error);
    res.status(500).send({ error: error.message });
  }
});


// // Post environment data to the Realtime Database
// app.post("/environment", async (req, res) => {
//   const environmentData = req.body; // Assume the request body contains environment data
//   try {
//     const newEnvRef = ref(realtimeDb, `System/Environment`); // Adjust as needed
//     await update(newEnvRef, environmentData);
//     res.status(201).send({ message: "Environment data added successfully" });
//   } catch (error) {
//     console.error("Error posting environment data: ", error);
//     res.status(500).send({ error: error.message });
//   }
// });

// // Post seats data to the Realtime Database
// app.post("/environment/:id/seats", async (req, res) => {
//   const { id } = req.params;
//   const seatsData = req.body; // Assume the request body contains seats data
//   try {
//     const newSeatsRef = ref(realtimeDb, `System/Seats`);
//     await update(newSeatsRef, seatsData);
//     res.status(201).send({ message: "Seats data added successfully" });
//   } catch (error) {
//     console.error("Error posting seats data: ", error);
//     res.status(500).send({ error: error.message });
//   }
// });

app.post("/SetState", async (req, res) => {
    const Data = req.body; 
    try {
        console.log(Data)
      const newSeatsRef = ref(realtimeDb, `System`);
      await update(newSeatsRef, {
        "/Environment": Data["Environment"],
        "/Seats":Data["Seats"]
      });
      res.status(201).send({ message: "Seats data added successfully" });
    } catch (error) {
      console.error("Error posting seats data: ", error);
      res.status(500).send({ error: error.message });
    }
  });

<<<<<<< HEAD
// Post animation state to the Realtime Database
=======
// Send Data to Unity and Emit Event
app.post("/sendToUnity", async (req, res) => {
    console.log(req.body);
    try {
        const docRef = doc(db, "System", "uZCY1O4xlKq2AOWAnm1F");

        // Combine the deletion of the Seats field and the update in a single updateDoc call
        await updateDoc(docRef, {
            Seats: deleteField(),  // Delete the Seats field
            ...req.body            // Merge in the new data from the request body
        });

        isChange['check'] = String(req.body.Environment);
        res.status(200).send("Document updated successfully");
    } catch (error) {
        console.error("Error updating document: ", error);
        res.status(500).send("Error updating document");
    }
});



app.get("/EnvChange", async (req, res) => {
    res.send(isChange['check']);
});

// Handle Animation State
>>>>>>> 4bb6b67622a2b3f76871f248d7968be82c38967c
app.post("/AnimationState", async (req, res) => {
  const animationState = req.body; // Assume the request body contains animation state
  try {
    const updates = {};
    updates["System/AnimationState"] = animationState["ANIMATION_STATE"];
    await update(ref(realtimeDb), updates);
    res.status(201).send({ message: "Animation state updated successfully" });
  } catch (error) {
    console.error("Error posting animation state: ", error);
    res.status(500).send({ error: error.message });
  }
});

// Get the animation state from the Realtime Database
app.get("/AnimationState", async (req, res) => {
  try {
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `System/AnimationState`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          res.send({State:snapshot.val()});
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error("Error fetching animation state: ", error);
    res.status(500).send({ error: "Error fetching animation state" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
