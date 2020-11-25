1.  $env:INPUT_URL="https://Download.qognify.com"       -  add the url to the env for test
2.  $env:INPUT_TOKEN="bzdnRXJ4RlVrZkl5VjFVU3l6dExTSA==" -  add the token to the env for test
3.  $env:INPUT_DAYS="7"                                 -  add the day to the env for test
4.  $env:INPUT_FOLDER="C:\Test\Liq"                     -  add the folder to the env for test
5.  $env:INPUT_AUTH="true"                              -  add the auth to the env for test
6.  $env:INPUT_PRIVATE="0"                              -  add the privat to the env for test
7. $env:INPUT_POOL="tomer-test"                        -  add the pool to the env for test
8. $env:INPUT_EMAILS="avih75@gmail.com"                -  add the client mail to the env for test
 
9.  tsc                                                      - compile the project
10. node index.js                                            - run the index file for test
11. tfx extension create --manifest-globs vss-extension.json - compile to the extenshen file
 
<!-- token = "Basic bzdnRXJ4RlVrZkl5VjFVU3l6dExTSA=="   -->