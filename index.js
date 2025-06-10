const net=require('net');

const server=net.createServer(connection=>{
    console.log('client connected...');

    connection.on('data',data=>{
        console.log(data.toString()); // encoded data which follows Redis serialization protocol(RESP)
        // set name pranetha , is encoded as ....
        // *3 ---> * for arrays....since 3 strings are there , so size 3
        // $3 ---> $ for each string .... since 'set' is string of size 3
        // set
        // $4 ---> 'name' is a string of size 4
        // name
        // $8 ---> 'pranetha' is a string of size 8
        // pranetha

        connection.write('+OK\r\n'); // now for every query , this message will be sent
    })
})


const PORT=8000;
server.listen(PORT,()=>{console.log(`custom redis server running on port ${PORT}`)});
// redis-cli -p 8000 , as CLI client