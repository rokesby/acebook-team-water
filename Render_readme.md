# Render Deployment

## Setup tasks
~~Deploy a web service
- Select a GitHub repository
- Build command? Npm install
	- By one folder not two /api /frontend
- Start command? Npm run dev
- Environment variables
	- By one folder and not two, so I put the 4 items into 1 collection.
Hit deploy!~~

---
## Trying with two different services
Split into two services.
### Frontend
==Do we== need the localhost env variable?
 > Build successful
No open ports detected on 0.0.0.0 - do we mean to bind them?

### API
Build command - npm install 
Start command - npm run dev
> Got a Mongoose Error
>  error: MongoNetworkError: connect ECONNREFUSED 0.0.0.0:27017

Failed running 'index.js'
> No open ports detected, continuing to scan...
> Docs on specifying a port: https://render.com/docs/web-services#port-binding


Dear Render Support,

I'm trying to deploy my first web service to Render.

I have two related services and they are both failing.
I have a frontend and an API service. Both are running on a simple MERN stack.

For the frontend service https://acebook-team-water-fe.onrender.com
I am receving a fail to deploy status on the dashboard.

I have read the following guidance:
https://docs.render.com/web-services#port-binding

and I suspect the failure is related to this after reading the logs.

The only environment variable and probably the only related config is this:

VITE_BACKEND_URL
which I have set to http://0.0.0.0:3000
[==> No open ports detected on 0.0.0.0, continuing to scan...]

and http://localhost:3000
to no avail.

Can you provide any guidance as to what I might need to change please?

If I can get this working, I'll then tackle the api server next which utilises Mongoose/Mongo.

Many thanks,


Your request (71010) has been received and will be reviewed by our team.