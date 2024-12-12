##Automating startup on the RasPi

1. Create a systemd service file:

Open a new file for editing:

```
    sudo nano /etc/systemd/system/myproject.service
```

2. Add the following content to the file:

```
    [Unit]
    Description=Start NPM and Firefox on boot
    After=network.target

    [Service]
    Type=simple
    User=pi
    ExecStartPre=/usr/bin/xinit
    ExecStart=/bin/bash -c 'cd /home/pi/projects/123 && npm run dev'
    ExecStartPost=/usr/bin/firefox http://localhost:1234

    [Install]

    WantedBy=default.target
```

Adjust the paths and user if necessary. The ExecStartPre line ensures that the X server is running before starting Firefox.

3. Enable the service:

```
    sudo systemctl enable myproject.service
```
4. Start the service:

```
    sudo systemctl start myproject.service
```
This setup will ensure that your Raspberry Pi runs the npm run dev command and opens Firefox to localhost:1234 on boot. If you encounter any issues, you can check the status of the service with:

```
    sudo systemctl status myproject.service
```
