# Nodejs Express Docker Kubernetes app

Simple Express web app to prototype docker and kubernetes integration.

## stack
Nodejs - Express
Docker
Kubernetes

## Docker
using   `dockerfile` file to configure the docker image, it has the following content:
```yml
# use node version 16 image
FROM node:16
#change wordirectionto /app (actually it does create it if doesn't exist
WORKDIR /app
# copy all contet from current direction to destination image, add .dockerignore file to exclude node_modules
COPY . .
# install dependencies
RUN npm ci 
# expose the port our express app is using
EXPOSE 8080
# command to be run when we run 'docker run' or 'docker start'
# btw there is alaso the ENTYPOINT command, the difference is one doesn't accept params during the docker run commands
CMD [ "node","server.js" ]
```
- [x] to **build** the image, we run  `docker build -t <image_name> . ` 
so it looks in the current directory for he `dockerfile`.
- [x] to **create&Start** the container we can run a single command : 
`docker run <image_name> -p 5010:8080` which told docker to create and start
our container based on the image_name we give, we also need to map the ports
meaning that on our machine we need to hit 5010 but docker maps it to 8080.
- to run the docker container in background, ad `-d` tag  detached mode, 

- to see runnign containers, run `docker ps -a`, if you see a container with status EXITED(0), means it runs and exited successfully.
- there is bunch other commands to interact with the container like accessing to the bash...


## Kubernetes
Simple one node cluster, with 2 replicas 
one service   
using `kube.yml` file, we configure kubernetes :

```yml


apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-auth
  labels:
    app: app-auth
spec:
  replicas: 2
  selector:
    matchLabels:
      app: app-auth
  template:
    metadata:
      labels:
        app: app-auth
    spec:
      containers:
      - name: app-auth
        image: app-auth-image
        # we use this so we only use our local images
        imagePullPolicy: Never
        ports: 
        - containerPort: 8080

--- 

apiVersion: v1
kind: Service
metadata:
  name: app-auth
spec:
  selector:
    app: app-auth
  ports:
  # port is the one our Pod will be using, while target port is the one docker uses
  - port: 5020
    targetPort: 8080
  type: LoadBalancer
```
Alright, the APIversion tells Kubernetes which kind of Kubernetes API( kuberneted main brain) to use, since depending on the version/kind , we
gain access to some object properties like for exemple in the kind `Service` we  access the ports and loadBalance .

- [x] run `kubectl create -f kube.yml` to create our kubernetes cluster cluster -> nodes->pods->containers [-> : includes] [imperative approach]
- [x] we can run `kubectl apply -f kube.yml` to create our cluster, it is called a declarative approach, and it is the one we use in production
- [x] To scale our cluster , we can add more pods like this: `kubectl scale --replicas=4 deployment/<app_name>`  . deployment is the API kind 
- finally, we use commnds like `kubectl get pods` or `kubectl get nodes`... to get the running clusters/nodes/pods..
