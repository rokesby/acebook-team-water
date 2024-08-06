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
