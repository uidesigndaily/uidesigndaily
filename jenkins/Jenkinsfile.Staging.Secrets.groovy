
pipeline {
    agent any

    environment {

        NAMESPACE = "staging"

        JENKINS_USER_CRED_ID = "remote-jenkins-user"
        REMOTE_HOST = credentials("uidd-bootstrap-host")
        REMOTE_NAME = "UIDD Bootstrap"

        DOCKER_REGISTRY_SECRET = credentials("uidd-docker-registry-secret-base64");
        MONGO_URI_SECRET = credentials("uidd-mongo-uri-staging-base64");

        JWT_SECRET = credentials("uidd-secret-staging-jwt");
        MAILCHIMP_KEY = credentials("uidd-secret-staging-mailchimp-key");
        UPLOADER_AUTH = credentials("uidd-secret-staging-uploader-auth");
        GOOGLE_SECRET = credentials("uidd-secret-staging-google-secret");
        GOOGLE_CLIENT_ID = credentials("uidd-secret-staging-google-client-id");
        FACEBOOK_SECRET = credentials("uidd-secret-staging-facebook-secret");
        FACEBOOK_APP_ID = credentials("uidd-secret-staging-facebook-app-id");
        TWITTER_SECRET = credentials("uidd-secret-staging-twitter-secret");
        TWITTER_KEY = credentials("uidd-secret-staging-twitter-key");
        MAILGUN_KEY = credentials("uidd-secret-staging-mailgun-key");
        MAILGUN_DOMAIN = credentials("uidd-secret-staging-mailgun-domain");
        ADMIN_FNAME = credentials("uidd-secret-staging-admin-first-name");
        ADMIN_LNAME = credentials("uidd-secret-staging-admin-last-name");
        ADMIN_EMAIL = credentials("uidd-secret-staging-admin-email");
        ADMIN_PASSWORD = credentials("uidd-secret-staging-admin-password");
        SLACK_TOKEN = credentials("uidd-secret-staging-slack-token");
        APM_TOKEN = credentials("uidd-secret-staging-apm-token");
        APM_URL = credentials("uidd-secret-staging-apm-url");
        ELASTICSEARCH_URI = credentials("uidd-secret-staging-elasticsearch-uri");
        ELASTICSEARCH_USER = credentials("uidd-secret-staging-elasticsearch-user");
        ELASTICSEARCH_PASSWORD = credentials("uidd-secret-staging-elasticsearch-password");

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

        stage("Configure Secrets") {
            steps {
                sh "sed -i -e \'s/\\r\$//\' jenkins/configure-secrets.sh"
                sh "chmod +x jenkins/configure-secrets.sh"

                sh "./jenkins/configure-secrets.sh $DOCKER_REGISTRY_SECRET eks/staging/secrets/1-docker-registry-secret.yml"
                sh "./jenkins/configure-secrets.sh $MONGO_URI_SECRET eks/staging/secrets/2-mongo-uri-secret.yml"
            }
        }

        stage("Cluster Setup Secrets") {
            steps {
                script {
                    cluster_setup_secrets()
                }
            }
        }

    }
}


def git_checkout() {
    git branch: "main", credentialsId: "andrei-github-credentials", url: "https://github.com/uidesigndaily/website.git"
}


def cluster_setup_secrets() {
    withCredentials([
            usernamePassword(credentialsId: JENKINS_USER_CRED_ID, usernameVariable: "user", passwordVariable: "password")
        ]) {
            def remote = [:]
            remote.user = "${user}"
            remote.password = "${password}"
            remote.host = "${REMOTE_HOST}"
            remote.name = "${REMOTE_NAME}"
            remote.allowAnyHosts = true

            stage("Deploy Secrets") {
                sshPut remote: remote, from: "eks/staging/secrets", into: "."
                sshCommand remote: remote, command: "kubectl apply -f secrets"
                sshCommand remote: remote, command: "rm -rf secrets"

                /** JWT Secret */
                sshCommand remote: remote, command: "kubectl delete secret jwtsecret -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic jwtsecret -n $NAMESPACE --from-literal=JWT_SECRET=$JWT_SECRET"

                /** Mailchimp Key */
                sshCommand remote: remote, command: "kubectl delete secret mailchimpkey -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic mailchimpkey -n $NAMESPACE --from-literal=MAILCHIMP_KEY='$MAILCHIMP_KEY'"

                /** Secret for Uploader Authentication (will be deprecated once authentication is implemented) */
                sshCommand remote: remote, command: "kubectl delete secret uploaderauth -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic uploaderauth -n $NAMESPACE --from-literal=UPLOADER_AUTH=$UPLOADER_AUTH"

                /** Google Oauth Secrets */
                sshCommand remote: remote, command: "kubectl delete secret googlesecret -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic googlesecret -n $NAMESPACE --from-literal=GOOGLE_SECRET=$GOOGLE_SECRET"

                sshCommand remote: remote, command: "kubectl delete secret googleclientid -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic googleclientid -n $NAMESPACE --from-literal=GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID"

                /** Facebook Oauth Secrets */
                sshCommand remote: remote, command: "kubectl delete secret facebooksecret -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic facebooksecret -n $NAMESPACE --from-literal=FACEBOOK_SECRET=$FACEBOOK_SECRET"

                sshCommand remote: remote, command: "kubectl delete secret facebookappid -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic facebookappid -n $NAMESPACE --from-literal=FACEBOOK_APP_ID=$FACEBOOK_APP_ID"

                /** Twitter Oauth Secrets */
                sshCommand remote: remote, command: "kubectl delete secret twittersecret -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic twittersecret -n $NAMESPACE --from-literal=TWITTER_SECRET=$TWITTER_SECRET"

                sshCommand remote: remote, command: "kubectl delete secret twitterkey -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic twitterkey -n $NAMESPACE --from-literal=TWITTER_KEY=$TWITTER_KEY"

                /** Mailgun Secrets */
                sshCommand remote: remote, command: "kubectl delete secret mailgunkey -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic mailgunkey -n $NAMESPACE --from-literal=MAILGUN_KEY=$MAILGUN_KEY"

                sshCommand remote: remote, command: "kubectl delete secret mailgundomain -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic mailgundomain -n $NAMESPACE --from-literal=MAILGUN_DOMAIN=$MAILGUN_DOMAIN"

                /** UIDD Admin Credentials */
                sshCommand remote: remote, command: "kubectl delete secret adminfname -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic adminfname -n $NAMESPACE --from-literal=ADMIN_FNAME=$ADMIN_FNAME"

                sshCommand remote: remote, command: "kubectl delete secret adminlname -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic adminlname -n $NAMESPACE --from-literal=ADMIN_LNAME=$ADMIN_LNAME"

                sshCommand remote: remote, command: "kubectl delete secret adminemail -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic adminemail -n $NAMESPACE --from-literal=ADMIN_EMAIL=$ADMIN_EMAIL"

                sshCommand remote: remote, command: "kubectl delete secret adminpassword -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic adminpassword -n $NAMESPACE --from-literal=ADMIN_PASSWORD=$ADMIN_PASSWORD"

                /** Slack Secret */
                sshCommand remote: remote, command: "kubectl delete secret slacktoken -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic slacktoken -n $NAMESPACE --from-literal=SLACK_TOKEN=$SLACK_TOKEN"

                /** APM Secrets */
                sshCommand remote: remote, command: "kubectl delete secret apmtoken -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic apmtoken -n $NAMESPACE --from-literal=APM_TOKEN=$APM_TOKEN"

                sshCommand remote: remote, command: "kubectl delete secret apmurl -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic apmurl -n $NAMESPACE --from-literal=APM_URL=$APM_URL"

                sshCommand remote: remote, command: "kubectl delete secret elasticsearchuri -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic elasticsearchuri -n $NAMESPACE --from-literal=ELASTICSEARCH_URI=$ELASTICSEARCH_URI"

                sshCommand remote: remote, command: "kubectl delete secret elasticsearchuser -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic elasticsearchuser -n $NAMESPACE --from-literal=ELASTICSEARCH_USER=$ELASTICSEARCH_USER"

                sshCommand remote: remote, command: "kubectl delete secret elasticsearchpassword -n $NAMESPACE --ignore-not-found"
                sshCommand remote: remote, command: "kubectl create secret generic elasticsearchpassword -n $NAMESPACE --from-literal=ELASTICSEARCH_PASSWORD=$ELASTICSEARCH_PASSWORD"

            }
        }
}
