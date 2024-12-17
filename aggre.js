const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/aggree", {
      serverSelectionTimeoutMS: 5000, // Set timeout for server selection
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

const personSchema = new mongoose.Schema(
  {
    person_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    vocation: {
      type: String,
      enum: ["ENGINEER", "DOCTOR", "TEACHER", "OTHER"], // Adjust the options as needed
      required: true,
    },
    address: {
      number: {
        type: Number,
        required: true,
      },
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Person = mongoose.model("Person", personSchema);

const data = [
  {
    person_id: "6392529400",
    firstname: "Elise",
    lastname: "Smith",
    vocation: "ENGINEER",
    address: {
      number: 5625,
      street: "Tipa Circle",
      city: "Wojzinmoj",
    },
  },
  {
    person_id: "1723338115",
    firstname: "Olive",
    lastname: "Ranieri",
    vocation: "ENGINEER",
    address: {
      number: 9303,
      street: "Mele Circle",
      city: "Tobihbo",
    },
  },
  {
    person_id: "8732762874",
    firstname: "Toni",
    lastname: "Jones",
    vocation: "OTHER",
    address: {
      number: 1,
      street: "High Street",
      city: "Upper Abbeywoodington",
    },
  },
  {
    person_id: "7363629563",
    firstname: "Bert",
    lastname: "Gooding",
    vocation: "OTHER",
    address: {
      number: 13,
      street: "Upper Bold Road",
      city: "Redringtonville",
    },
  },
  {
    person_id: "1029648329",
    firstname: "Sophie",
    lastname: "Celements",
    vocation: "ENGINEER",
    address: {
      number: 5,
      street: "Innings Close",
      city: "Basilbridge",
    },
  },
  {
    person_id: "7363626383",
    firstname: "Carl",
    lastname: "Simmons",
    vocation: "ENGINEER",
    address: {
      number: 187,
      street: "Hillside Road",
      city: "Kenningford",
    },
  },
];

const insertData = async () => {
  try {
    const result = await Person.insertMany(data);
    console.log("Data inserted successfully:");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};


const perfromOperation = async()=>{
    try{
        const indx = await Person.listIndexes()
        console.log("indx", indx);

    }catch(error){
        console.log("error", error);
    }
}

const mainFunction = async () => {
  try {
    await dbConnect();
    await perfromOperation();
    mongoose.disconnect();
  } catch (error) {
    console.error("Error in mainFunction:", error);
  }
};

mainFunction();
