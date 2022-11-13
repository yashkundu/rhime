import {app} from './app'
import {ds} from './ds/redis'

const start = async () => {
    try {
        
        const envVariables = ['ACCESS_TOKEN_SECRET', 
        'SPOTIFY_CLIENT_KEY']

        for(const x of envVariables){
            if(!process.env[x]) throw new Error('Environment variables not declared')
        }

        await ds.connect({
            host: '127.0.0.1',
            port: 6379
        })
        
        app.listen(13050, () => {
            console.log('Spotify service listening on port 8000...');
        })
        
    } catch (error) {
        console.log(error);
    }
}

start()


