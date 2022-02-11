import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails({ meetupData }) {

    return (
        <>
            <Head>
                <title>{meetupData.title}</title>
                <meta
                    name="description"
                    content={meetupData.description} />
            </Head>
            <MeetupDetail
                image={meetupData.image}
                title={meetupData.title}
                address={meetupData.address}
                description={meetupData.description}
            />
        </>
    )
}

export async function getStaticPaths() {

    const client = await MongoClient.connect("mongodb+srv://kerim:admin0077@cluster0.2gyky.mongodb.net/meetups?retryWrites=true&w=majority")

    const db = client.db()

    const meetupsCollection = db.collection('meetups')

    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()

    client.close()

    return {
        fallback: 'blocking',
        paths: meetups.map(meetup => ({
            params: {
                meetupId: meetup._id.toString()
            }
        }))
    }
}

export async function getStaticProps(ctx) {

    const meetupId = ctx.params.meetupId

    const client = await MongoClient.connect("mongodb+srv://kerim:admin0077@cluster0.2gyky.mongodb.net/meetups?retryWrites=true&w=majority")

    const db = client.db()

    const meetupsCollection = db.collection('meetups')

    const selectedMeetup = await meetupsCollection.findOne({
        _id: ObjectId(meetupId)
    })

    client.close()

    return {
        props: {
            meetupData: {
                _id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                image: selectedMeetup.image,
                address: selectedMeetup.address,
                description: selectedMeetup.description
            }
        }
    }
}

export default MeetupDetails;