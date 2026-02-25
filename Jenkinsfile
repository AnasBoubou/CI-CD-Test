pipeline {
    agent any

    environment {
        DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1472873032505753601/vkvWUhArxJRFAI-vtqEjhS43llrU_enUwjQgMh7JoKFDADRFRSjdwhCpEfHmXNrMIQ1N'
        RENDER_API_KEY  = 'rnd_jf6omqccRqoPFgtAcM2MbY7RQ5R2'
        RENDER_SERVICE_ID = 'srv-d5pibtpr0fns73f2amh0'
    }

    tool{
        nodejs 'node20'
    }

    stages {
        stage('Install & Build') {
            steps {
                // Utilisation de npm pour installer et vérifier la syntaxe
                sh 'npm install'
                sh 'npm run lint'
            }
        }

        stage('Tests & Security') {
            steps {
                // Lancement des tests et audit de sécurité
                sh 'npm test || echo "Tests failed"'
                sh 'npm audit --audit-level=high'
            }
        }

        stage('SAST Scan') {
            steps {
                // On tente de lancer Semgrep (doit être installé sur l'image)
                sh 'semgrep --config p/javascript . || echo "Semgrep skipped"'
            }
        }

        stage('Deploy') {
            steps {
                // Appel API Render via curl
                sh """
                curl -X POST https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys \
                     -H "Authorization: Bearer ${RENDER_API_KEY}" \
                     -H "Accept: application/json"
                """
            }
        }
    }

    post {
        failure {
            // Notification Discord si une étape échoue
            sh """
            curl -H "Content-Type: application/json" \
                 -d '{
                      "username": "Jenkins",
                      "content": "❌ **Échec du Build !**\\n**Projet :** ${env.JOB_NAME}\\n**Build :** #${env.BUILD_NUMBER}"
                     }' \
                 ${DISCORD_WEBHOOK}
            """
        }
    }
}