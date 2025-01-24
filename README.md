1. Make sure you have Docker installed on your machine.

2. Run the following command in the root directory:

```sh
npm run dev
```

**Possible Errors**

1. if the permissions are not correct, run the following command:

```sh
chmod +x start-script.sh
```

2. if you get an error like this: `permission denied while trying to connect to the Docker daemon socket at ...`

run the following command:

```
sudo usermod -aG docker $USER
newgrp docker
```

3. Open your browser and navigate to http://localhost:3000
