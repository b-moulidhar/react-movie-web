import {Client, Databases, ID, Query} from 'appwrite'
const PROJECT_ID = import.meta.env.VITE_APPWRITE_KEY_ID;
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_MOVIES_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(PROJECT_ID);

const database = new Databases(client);
export const updateSearchCount= async(searchTerm, movie)=>{
    // use appwrite sdk to check if search term in db
    try {
        const result = await database.listDocuments(DB_ID,COLLECTION_ID,[Query.equal('searchTerm',searchTerm)])
        if(result.documents.length>0){
            const doc = result.documents[0];
            await database.updateDocument(DB_ID,COLLECTION_ID,doc.$id, {count: doc.count +1,})
        }else{
            await database.createDocument(DB_ID,COLLECTION_ID, ID.unique(),{
                searchTerm,
                count:1,
                movie_id: movie.id,
                poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    } catch (error) {
        console.log(error)
    }
}
export const getTrendingMovie= async()=>{
    try {
        const result = await database.listDocuments(DB_ID,COLLECTION_ID,[Query.limit(5), Query.orderDesc('count')])
        console.log("result_++__",result);
        return result.documents;
    } catch (error) {
        console.log(error)
    }
}