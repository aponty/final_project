echo 'local tunneling script started'

function localtunnel {
    lt -s arduinorelaytunnel --port 8080
}

while (1) {
localtunnel

Start-Sleep -s 30

echo 'if it made it here the tunnel crashed. restarting'
}
