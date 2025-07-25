pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        IMAGE_NAME     = "mycryptotracker"
        IMAGE_TAG      = "v1.0"
        CONTAINER_NAME = "mycryptotracker_container"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
                    sh """
                        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    """
                }
            }
        }

        stage('Stop Existing Container (if running)') {
            steps {
                script {
                    sh """
                        docker ps -q --filter "name=${CONTAINER_NAME}" | grep -q . && docker stop ${CONTAINER_NAME} || echo "No container to stop"
                        docker rm -f ${CONTAINER_NAME} || true
                    """
                }
            }
        }

        stage('Run Updated Container') {
            steps {
                script {
                    sh """
                        docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }
    }
}
