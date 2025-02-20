// import { MongoClient } from "mongodb";

// const MONGO_URI: string = process.env.MONGO_URI || "mongodb+srv://abdulofficialbtw:Ut6IUTxVqspzGFaj@cluster0.c1pdl.mongodb.net/auth_?retryWrites=true&w=majority";

// const client: MongoClient = new MongoClient(MONGO_URI, {
//     tls: true,
//     tlsAllowInvalidCertificates: true, 
// });

// export const connectDB = async (): Promise<void> => {
//     try {
//         await client.connect();
//         console.log("MongoDB Connected");
//     } catch (error) {
//         console.error(" MongoDB Connection Error:", error);
//         process.exit(1);
//     }
// };

// export const db = client.db("auth_");



import { MongoClient } from "mongodb";
const MONGO_URI: string = "mongodb+srv://abdulofficialbtw:Y9gSBH10bekJLY1n@cluster0.t5s2l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client: MongoClient = new MongoClient(MONGO_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true, 
} );

export const connectDB = async (): Promise<void> => {
    try {
        await client.connect();
        console.log(" MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export const db = client.db("auth_");




// export const disconnectDB = async () => {
//     try {
//         if (client.topology && client.topology.isConnected()) {
//             await client.close();
//             console.log("MongoDB Disconnected");
//         }
//     } catch (error) {
//         console.error("Error disconnecting from MongoDB:", error);
//     }
// };