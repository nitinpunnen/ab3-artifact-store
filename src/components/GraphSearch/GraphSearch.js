import React, {useEffect} from "react";
import "./GraphSearch.css";
import "@aws-amplify/ui-react/styles.css";
import {
    Flex,
    Heading, SearchField,

} from '@aws-amplify/ui-react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {API} from "aws-amplify";
// Load Highcharts modules
require('highcharts/modules/networkgraph')(Highcharts);

const options = {
    chart: {
        type: "networkgraph",
        marginTop: 20
    },
    title: {
        text: "Anycompany Artifacts"
    },
    plotOptions: {
        networkgraph: {
            keys: ["from", "to", "type"],
            layoutAlgorithm: {
                enableSimulation: true,
                gravitationalConstant: 0.2,
                friction: -0.9
            }
        }
    },
    series: [
        {
            events: {
                click: (e) => {
                    this.onClick(e);
                }
            },
            marker: {
                radius: 10
            },
            dataLabels: {
                enabled: true,
                linkFormat: "",
                allowOverlap: true
            },
            data: [
                ["78291, United Airlines", "81201, Fuselage", "Airplane"],
                ["78291, United Airlines", "32812, Tail"],
                ["78291, United Airlines", "32918, Wings"],
                ["78291, United Airlines", "55923, APU"],
                ["78291, United Airlines", "12311, Engine"],
                ["78291, United Airlines", "91212, Landing Gear"],
                ["81201, Fuselage", "32112, 43 Sec"],
                ["81201, Fuselage", "32113, 44 Sec"],
                ["81201, Fuselage", "32321, Aft"],
                ["32321, Aft", "42321, Aft Lwr Cargo Door"],
                ["42321, Aft Lwr Cargo Door", "42341, Aft Door"],
                ["32113, 44 Sec", "15441, AOE Doors"],
                ["32918, Wings", "32391, Inboard Flap"],
                ["32918, Wings", "12123, Spoilers"],
                ["32812, Tail", "93212, Tail Cone"],
                ["32812, Tail", "93241, Rudder"],
                ["32812, Tail", "93242, Tail Cone Spirit"],
                ["93212, Tail Cone", "15441, Flap Track Fairing"],
                ["93212, Tail Cone", "15241, Flap Track"],
                ["93212, Tail Cone", "15241, Stabilizer Tip"],
                ["93241, Rudder", "52341, Stabilizer"],
                ["93241, Rudder", "65341, Cone Spirit"],
                ["93241, Rudder", "32341, Vertical Fin"],
                ["93241, Rudder", "35441, Left Fin Panel"],
                ["93241, Rudder", "15441, Right Fin Panel"],
                ["15441, Flap Track Fairing", "15241, Aileron"],
                ["15441, Flap Track Fairing", "96241, Winglet"],
                ["96241, Winglet", "96241, Inboard Flaps"],
                ["15241, Flap Track", "96241, Outboard Flaps"],
                ["15241, Stabilizer Tip", "Konfirmat 23.0"],
                ["91212, Landing Gear", "Rear Camera 92.1 3/5"],
                ["91212, Landing Gear", "2322A, Suspension"],
                ["2322A, Suspension", "Spring Suspension"],
                ["2322A, Suspension", "Coil Metal 391.2"],
                ["2322A, Suspension", "Metal Fixture 2.2"],
                ["12311, Engine", "93242, Engine CFM"],
                ["12311, Engine", "33242, Fan Cowl"],
                ["12311, Engine", "32242, Thruster Assembly"],
                ["12311, Engine", "52242, Primary Exhaust"]
            ],
            nodes: [{
                id: '78291, United Airlines',
                color: '#22577A',
                marker: { radius: 20 }
            }],
        }
    ]
};

const GraphSearch = () => {

    useEffect(() => {
        updateGraph();
    }, []);

    async function updateGraph(value) {
        const response = await API.get('searchNeptune', '/search', {
            headers: {},
            response: true,
            queryStringParameters: {
                query: value
            }});
        console.log(response);
    }

    return (
        <Flex
            direction={{base: 'column', large: 'column'}}
            padding="1rem"
            width="100%"
        >
            <Heading level={4} style={{textAlign: "left"}}>Entity Search</Heading>
            <Flex direction={{base: 'row', large: 'row'}}
                  padding="1rem"
                  width="50%"
                  style={{alignItems: "center", margin: "auto", display: "block"}}
            >
                <SearchField
                    label="Search"
                    placeholder="Search for Entities..."
                    size={"large"}
                    onSubmit={(value) => updateGraph(value)}
                />
            </Flex>
            <HighchartsReact highcharts={Highcharts} options={options} containerProps={{ style: { height: "800px", display: "block", width: "90%", margin: "0 auto" } }}/>
        </Flex>
    );
};

export default GraphSearch;