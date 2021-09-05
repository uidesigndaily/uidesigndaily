
pipeline {
    agent any

    environment {
        VERSION = readFile('VERSION')
        JENKINS_USER_CRED_ID = "remote-jenkins-user"
        REMOTE_HOST = credentials("uidd-bootstrap-host")
        REMOTE_NAME = "UIDD Bootstrap"
    }

    parameters {
        string(name:"par_deployment_version", defaultValue:"", description:"Specify the version to be deployed to production")
    }

    stages {

        stage('Preparation') {
            steps {
                script {
                    cleanWs()
                    git_checkout()
                }
            }
        }

        stage('Setup Parameters') {
            steps {
                script {
                    properties([
                        parameters([
                            string(name: "par_deployment_version", defaultValue: "${params.par_deployment_version}", description: "Specify the version to be deployed to production")
                        ])
                    ])
                }
            }
        }

        stage('Configure Version') {
            steps {
                sh "sed -i -e \'s/\\r\$//\' jenkins/configure-version.sh"
                sh "chmod +x jenkins/configure-version.sh"
                sh "./jenkins/configure-version.sh ${params.par_deployment_version} eks/production/deployment/3-deployment.yml"
            }
        }

        stage('Cluster Deploy') {
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
                sshPut remote: remote, from: "eks/production/deployment", into: "."
                sshCommand remote: remote, command: "kubectl apply -f deployment"
                sshCommand remote: remote, command: "rm -rf deployment"
            }
        }
}
