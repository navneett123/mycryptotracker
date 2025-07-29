pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        IMAGE_NAME      = "mycryptotracker"
        IMAGE_TAG       = "v1.0"
        FULL_IMAGE      = "navneet78/${IMAGE_NAME}:${IMAGE_TAG}"
        CONTAINER_NAME  = "mycryptotracker_container"
    }

    stages {

        stage('📥 Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('🐳 Build & Push Docker Image') {
            steps {
                sh "docker build -t ${FULL_IMAGE} ."

                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                        echo "$PASS" | docker login -u "$USER" --password-stdin
                        docker push ${FULL_IMAGE}
                        docker logout
                    """
                }
            }
        }

        stage('🧹 Stop Old Container (if any)') {
            steps {
                sh """
                    docker ps -q --filter "name=${CONTAINER_NAME}" | grep -q . && docker stop ${CONTAINER_NAME} || true
                    docker rm -f ${CONTAINER_NAME} || true
                """
            }
        }

        stage('🚀 Run Container from Docker Hub') {
            steps {
                sh """
                    docker pull ${FULL_IMAGE}
                    docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${FULL_IMAGE}
                """
            }
        }
    }
}
