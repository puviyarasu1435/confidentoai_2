const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./firebaseConfig"); // Ensure this is correctly set up
const { collection, addDoc, getDocs, doc, getDoc, updateDoc } = require("firebase/firestore");
const path = require("path");
const GeminiAIRoutes = require("./routes/Gemini");

const ANIMATION_STATE = {STATE:"IDEL"}; 
const isChange = {check:""};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// WebSocket connection setup
io.on("connection", (socket) => {
    console.log("Client connected");

    // Send the current animation state to the newly connected client
    socket.emit("AnimationState", { ANIMATION_STATE });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Load initial state from Firebase when the server starts // Call to load the initial state

app.use("/AI", GeminiAIRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Environment Routes
app.post("/environment", async (req, res) => {
    const newEnvironment = {
        Name: req.body.Name || "",
        Index: req.body.Index || 0,
    };

    try {
        const docRef = await addDoc(collection(db, "Environment"), newEnvironment);
        res.status(201).send({ id: docRef.id, ...newEnvironment });
    } catch (error) {
        console.error("Error adding document: ", error);
        res.status(500).send({ error: error.message });
    }
});

app.get("/environment", async (req, res) => {
    try {
        const snapshot = await getDocs(collection(db, "Environment"));
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

app.get("/environment/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const docRef = doc(db, "Environment", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res.status(404).send({ error: "Document not found" });
        }

        res.status(200).send({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
        console.error("Error fetching document: ", error);
        res.status(500).send({ error: error.message });
    }
});

// Get seats for an environment
app.get("/environment/:id/seats", async (req, res) => {
    const { id } = req.params;

    try {
        const envDoc = await getDoc(doc(db, "Environment", id));

        if (envDoc.exists()) {
            res.send(envDoc.metadata);
        } else {
            res.status(404).json({ error: "Environment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching environment data" });
    }
});

// Characters Route
app.get("/characters", async (req, res) => {
    try {
        const snapshot = await getDocs(collection(db, "Characters"));
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

// Send Data to Unity and Emit Event
app.post("/sendToUnity", async (req, res) => {
    console.log(req.body);
    try {
        const docRef = doc(db, "System", "uZCY1O4xlKq2AOWAnm1F");
        await updateDoc(docRef, req.body);
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
app.post("/AnimationState", async (req, res) => {
    ANIMATION_STATE['STATE'] = req.body.ANIMATION_STATE;
    res.send(ANIMATION_STATE);
});

app.get("/AnimationState", async (req, res) => {
    res.send(ANIMATION_STATE['STATE']);
});

app.get("/AnimationState1", async (req, res) => {
    res.json({State:ANIMATION_STATE['STATE']});
});
// Get Current Animation State
app.get("/CurrentEnvironment", async (req, res) => {
    try {
        // Fetch the document from Firestore
        const envDoc = await getDoc(doc(db, "System", "uZCY1O4xlKq2AOWAnm1F"));

        if (envDoc.exists()) {
            // Get the document data
            let data = envDoc.data();

            // Extract only the Environment field
            const environmentValue = data.Environment;

            // Send the Environment value in the response
            res.send({ Environment: environmentValue });
        } else {
            res.status(404).json({ error: "Environment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching environment data" });
    }
});
// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port}`);
});
