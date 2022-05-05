/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("Run npm steps") {
    startOn {
        gitPush { 
            enabled = true,
            repository = "master"
        }
    }
    
    container(displayName = "Run publish script", image = "node:14-alpine") {
        env["REGISTRY"] = "https://npm.pkg.jetbrains.space/mycompany/p/projectkey/mynpm"
        shellScript {
            interpreter = "/bin/sh"
            content = """
            	echo install ionic/cli
                npm install -g @ionic/cli@6.18.1
                echo Install npm dependencies...
                npm ci
            """
        }
    }
}

job("Build and publish bundle to internal track") {
    startOn {
        gitPush { 
            enabled = true,
            repository = "master"
        }
    }

    container("Build and publish", "mycompany.registry.jetbrains.space/p/projectkey/mydocker/automation-android:1.0.5") {
        env["GOOGLE_SA_KEY"] = Secrets("google_sa_key")
        env["KEY_STORE"] = Secrets("key_store")
        env["KEY_STORE_PASSWORD"] = Secrets("key_store_password")
        env["KEY_PASSWORD"] = Secrets("key_password")
        env["KEY_ALIAS"] = Params("key_alias")

        shellScript {
            content = """
                echo Get private signing key...
                echo ${'$'}KEY_STORE > upload_key.hex
                xxd -plain -revert upload_key.hex  upload_key.jks
                echo Get Google service account key...
                echo ${'$'}GOOGLE_SA_KEY > google_sa_key.hex
                xxd -plain -revert google_sa_key.hex  google_sa_key.json
                echo Build and pulbish AAB...
                ./gradlew publishBundle
            """
        }
    }
}