import { SignupModel } from "../models/SignupModel";
import { MemoryModel } from "../models/MemoryModel";
import { ContentType } from "../interface/MemoryInterface";
import { passwordHashing } from "./passwordHasing";
import { deriveImage } from "./thumbnail";

export const DEMO_EMAIL = "demo@brainly.dev";
export const DEMO_PASSWORD = "Demo@12345";

const m = (type: ContentType, link: string, title: string, desc: string, tags: string[]) => ({
    type, link, title, desc, tags,
    image: deriveImage(type, link) ?? `https://picsum.photos/seed/${encodeURIComponent(title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}/640/360`,
});

const MEMORIES = [
    m(ContentType.YoutubeLink, "https://www.youtube.com/watch?v=Ke90Tje7VS0", "React in 100 seconds", "A fast overview of what React is and how components and state work.", ["react", "frontend", "video"]),
    m(ContentType.YoutubeLink, "https://www.youtube.com/watch?v=Z-0CJGI6m6A", "MongoDB explained", "Quick explanation of documents, collections and when to choose MongoDB.", ["mongodb", "database", "video"]),
    m(ContentType.Link, "https://roadmap.sh/backend", "Backend developer roadmap", "Step-by-step roadmap of what to learn to become a backend engineer.", ["backend", "roadmap", "learning"]),
    m(ContentType.Link, "https://owasp.org/www-project-top-ten/", "OWASP Top 10", "The ten most critical web application security risks, with prevention tips.", ["security", "owasp", "web"]),
    m(ContentType.Link, "https://jwt.io/introduction", "Introduction to JSON Web Tokens", "What a JWT is, its structure and when it is a good fit for authorization.", ["jwt", "auth", "security"]),
    m(ContentType.Tweet, "https://twitter.com/dan_abramov/status/1000000000000000000", "Thoughts on state management", "A thread about keeping state close to where it is used before reaching for global stores.", ["react", "state", "thread"]),
    m(ContentType.Tweet, "https://twitter.com/kentcdodds/status/1000000000000000001", "Testing tips", "Write tests that resemble how your software is used, not its implementation details.", ["testing", "javascript"]),
    m(ContentType.Pdf, "https://www.africau.edu/images/default/sample.pdf", "System design cheat sheet", "A PDF summary of load balancing, caching, sharding and replication trade-offs.", ["system-design", "pdf", "interview"]),
    m(ContentType.Link, "https://www.mongodb.com/docs/atlas/atlas-search/", "MongoDB Atlas Search docs", "Official documentation for full-text and vector search on Atlas.", ["mongodb", "search", "docs"]),
    m(ContentType.Link, "https://docs.docker.com/get-started/", "Docker get started guide", "Official tutorial on containers, images and compose for beginners.", ["docker", "devops", "learning"]),
];

// Idempotent demo data. Runs at start-up only when SEED_DEMO=true.
export const seedDemoData = async () => {
    let user = await SignupModel.findOne({ email: DEMO_EMAIL });
    if (!user) {
        user = await SignupModel.create({ name: "Demo User", email: DEMO_EMAIL, password: await passwordHashing(DEMO_PASSWORD) });
    }
    if ((await MemoryModel.countDocuments({ UserObjectId: user._id })) === 0) {
        await MemoryModel.insertMany(MEMORIES.map((x) => ({ ...x, UserObjectId: user!._id })));
    } else {
        // databases seeded before images existed: backfill the preview image by link
        await MemoryModel.bulkWrite(MEMORIES.map((x) => ({
            updateOne: { filter: { UserObjectId: user!._id, link: x.link, image: { $exists: false } }, update: { $set: { image: x.image } } },
        })));
    }
    console.log("Demo data ready (SEED_DEMO=true)");
};
