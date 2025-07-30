pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        IMAGE_NAME       = "mycryptotracker"
        IMAGE_TAG        = "v3.0"
        DOCKER_USER      = "navneet78"
        FULL_IMAGE       = "${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
        CONTAINER_NAME   = "mycryptotracker_container"
        META_FILE        = "build-info.json"
    }

    stages {

        stage('📥 Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        stage('🐳 Build & Push Docker Image') {
            steps {
                script {
                    sh "docker build -t ${FULL_IMAGE} ."

                    withCredentials([
                        usernamePassword(
                            credentialsId: 'dockerhub-creds',
                            usernameVariable: 'USER',
                            passwordVariable: 'PASS'
                        )
                    ]) {
                        sh """
                            echo "$PASS" | docker login -u "$USER" --password-stdin
                            docker push ${FULL_IMAGE}
                            docker logout
                        """
                    }
                }
            }
        }

        stage('📝 Generate Build Metadata') {
            steps {
                script {
                    def commitId  = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def timestamp = sh(script: 'date -u +"%Y-%m-%dT%H:%M:%SZ"', returnStdout: true).trim()

                    def metadata = """
                    {
                      "image": "${FULL_IMAGE}",
                      "tag": "${IMAGE_TAG}",
                      "commit": "${commitId}",
                      "timestamp": "${timestamp}"
                    }
                    """.stripIndent().trim()

                    writeFile file: META_FILE, text: metadata
                }
            }
        }

        stage('🧹 Stop Existing Container') {
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

    post {
        always {
            archiveArtifacts artifacts: "${META_FILE}", fingerprint: true
        }
    }
}
