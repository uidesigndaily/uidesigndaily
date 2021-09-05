
pipeline {
    agent any

    tools { nodejs "node-14.9.0" }

    environment {
        VERSION = readFile('VERSION')
        JENKINS_USER_CRED_ID = "remote-jenkins-user"
        REMOTE_HOST = credentials("uidd-bootstrap-host")
        REMOTE_NAME = "UIDD Bootstrap"
    }

    stages {

        stage("Preparation") {
            steps {
                script {
                    cleanWs()
                    git_checkout()
                }
            }
        }

        stage("Install Dependencies") {
            steps {
                sh "npm install"
                sh "cd client-react && npm install"
            }
        }

        stage("Build Project") {
            steps {
                sh "npm run build"
                sh "npm run build-client"
                sh "npm run build-react"
            }
        }

        stage("Build and Push Docker Images") {
            steps {
                script {
                    def version = readFile("VERSION")
                    def versions = version.split('\\.')
                    def major = versions[0]
                    def minor = versions[0] + '.' + versions[1]
                    def patch = version.trim()

                    docker.withRegistry('', "uidd-docker-credentials") {
                        def image = docker.build("uidesigndaily/web:latest")
                        image.push()
                        image.push(major)
                        image.push(minor)
                        image.push(patch)
                    }
                }
            }
        }

        stage("Configure Version") {
            steps {
                sh "sed -i -e \'s/\\r\$//\' jenkins/configure-version.sh"
                sh "chmod +x jenkins/configure-version.sh"
                sh "./jenkins/configure-version.sh $VERSION eks/staging/deployment/3-deployment.yml"
            }
        }

        stage("Cluster Deploy") {
            steps {
                script {
                    cluster_deploy()
                }
            }
        }

    }
}


def git_checkout() {
    git branch: "main", credentialsId: "andrei-github-credentials", url: "https://github.com/uidesigndaily/website.git"
}


def cluster_deploy() {
    withCredentials([
            usernamePassword(credentialsId: JENKINS_USER_CRED_ID, usernameVariable: "user", passwordVariable: "password")
        ]) {
            def remote = [:]
            remote.user = "${user}"
            remote.password = "${password}"
            remote.host = "${REMOTE_HOST}"
            remote.name = "${REMOTE_NAME}"
            remote.allowAnyHosts = true

            stage("Deploy to Staging") {
                sshPut remote: remote, from: "eks/staging/deployment", into: "."
                sshCommand remote: remote, command: "kubectl apply -f deployment"
                sshCommand remote: remote, command: "rm -rf deployment"
            }
        }
}
