import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList"


function HomePage({ meetups }) {

    return (
        <>
            <Head>
                <title>React Meetups</title>
                <meta
                    name="description"
                    content="Browse a huge list of highly active React meetups!" />
            </Head>
            <MeetupList meetups={meetups} />
        </>
    );
}

export async function getStaticProps() {
    // fetch data from an API/FS

    const client = await MongoClient.connect("mongodb+srv://kerim:admin0077@cluster0.2gyky.mongodb.net/meetups?retryWrites=true&w=majority")
    const db = client.db()

    const meetupsCollection = db.collection('meetups')

    const meetups = await meetupsCollection.find().toArray()

    client.close()

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                image: meetup.image,
                address: meetup.address,
                description: meetup.description,
                id: meetup._id.toString()
            }))
        },
        revalidate: 1,
    }
}

export default HomePage;


// //  using for a frequently changing data a couple of times in 1 seconds 
// //  or if we need to use ctx to change req/res objects

// export async function getServerSideProps(ctx) {

//     const req = ctx.req
//     const res = ctx.res

//     // fetch data from an API/FS
//     return {
//         props: {
//             meetups :  DUMMY_MEETUPS
//         }
//     }

// }