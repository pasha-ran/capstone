docker images --format='{{json .}}'|Select-String -Pattern "maheeraeron/flask-api" |   ConvertFrom-Json |  ForEach-Object -process { docker rmi -f $_.ID}
docker build -t maheeraeron/flask-api:latest .
docker push maheeraeron/flask-api:latest