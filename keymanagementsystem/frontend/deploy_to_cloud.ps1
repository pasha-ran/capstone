docker images --format='{{json .}}'|Select-String -Pattern "maheeraeron/react-app" |   ConvertFrom-Json |  ForEach-Object -process { docker rmi -f $_.ID}
docker build -t maheeraeron/react-app:latest .
docker push maheeraeron/react-app:latest