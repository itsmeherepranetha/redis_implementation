const net=require('net');
const Parser=require('redis-parser');

const store={};

const server=net.createServer(connection=>{
    console.log('client connected...');

    connection.on('data',data=>{

        //console.log(data.toString()); // encoded data which follows Redis serialization protocol(RESP)
        // set name pranetha , is encoded as ....
        // *3 ---> * for arrays....since 3 strings are there , so size 3
        // $3 ---> $ for each string .... since 'set' is string of size 3
        // set
        // $4 ---> 'name' is a string of size 4
        // name
        // $8 ---> 'pranetha' is a string of size 8
        // pranetha

        const parser=new Parser({
            returnReply:(reply)=>{
                //console.log('-->',reply); // like "set name pranetha" has reply=['set','name','pranetha']
                const command=reply[0];
                if(command=='set')
                {
                    const key=reply[1];
                    const value=reply[2];
                    store[key]=value;
                    connection.write('+OK\r\n');
                }
                else if(command=='get')
                {
                    const key=reply[1];
                    const value=store[key];
                    if(!value)connection.write('$-1\r\n'); // output as null (nil)
                    else connection.write(`$${value.length}\r\n${value}\r\n`) // output as a bulk string
                }
            },
            returnError:(err)=>{
                console.log('-->',err);
            }
        })

        parser.execute(data);
        //connection.write('+OK\r\n'); // now for every query , this message will be sent
    })
})


const PORT=8000;
server.listen(PORT,()=>{console.log(`custom redis server running on port ${PORT}`)});
// redis-cli -p 8000 , as CLI client