document.addEventListener('DOMContentLoaded', () => {


    const ipinput = document.getElementById('ip-input');
    ipinput.value = '';
    const scanbutton = document.getElementById('scan-button');
    const result = document.getElementById('results');
    const errorMessage = document.getElementById('error');
    const scanningmessage = document.getElementById('scanning-message');
    
    scanbutton.addEventListener('click', () =>
{
    const ipAddress = ipinput.value.trim();
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)){3}$/;



    result.textContent = '';
    errorMessage.textContent = '';
    result.style.display = 'none';
    errorMessage.style.display = 'none';

    scanningmessage.style.display= 'none';

    if(!ipv4Regex.test(ipAddress))
    {
        errorMessage.textContent = 'Please enter a valid IPv4 address';
        errorMessage.style.display = 'block';
        return;
    }

    scanbutton.disabled = true;
    scanningmessage.style.display = 'block';

    /* used for simulation nit fetching API and not doing proper scanning
    setTimeout(() => {

        scanbutton.disabled = false;
        

        const mockNmapOutput = (targetIp) => {
            let output = `Starting NMAP 7.80 (https://nmap.org)\n`;
            output += `Nmap can report for ${targetIp}\n`;
            output += `Host is up(0.0050s latency),\n`;
            output += `Port state service\n`;
            output += `22/tcp open ssh\n`;
            output += `80/tcp open http\n`;
            output += `443/tcp open https\n`;
            output += `\nNmap done: 1 IP address (1 host up) scanned in 2.05 seconds\n`;
            return output;
        };

        result.textContent = mockNmapOutput(ipAddress);
        result.style.display = 'block';

        scanningmessage.style.display = 'none';

    }, 2000);*/

    //fetch() api is used to fetch data for making network requests

    fetch('/api/scan', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ip:ipAddress}), // Convert IP to a JSON
    })

    .then(response => {
        if(!response.ok) {
            throw new Error('Server responses with an error');
        }
        return  response.json();
    })

    .then(data => {

        scanningmessage.style.display = 'none';
        scanbutton.disabled = false;

        if (data.success) {
            result.textContent = data.output;
            result.style.display = 'block';
        }
        else{
            errorMessage.textContent = data.error;
            errorMessage.style.display = 'block';
        }
    })


    .catch(error => {
        console.error('Error:', error);
        scanningmessage.style.display = 'none';
        scanbutton.disabled= false;
        errorMessage.textContent = 'Failed to connect to backend server';
        errorMessage.style.display = 'block';



    })


});

});