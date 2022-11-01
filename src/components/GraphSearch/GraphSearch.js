import React, {useEffect, useRef, useState} from "react";
import "./GraphSearch.css";
import "@aws-amplify/ui-react/styles.css";
import {
    Flex,
    Heading, SearchField, Table, TableBody, TableCell, TableHead, TableRow, Text,

} from '@aws-amplify/ui-react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {API} from "aws-amplify";
import person from "../../assets/person.png";
import organization from "../../assets/organization.png";
import location from "../../assets/location.png";
// Load Highcharts modules
require('highcharts/modules/networkgraph')(Highcharts);

let options = {
    chart: {
        type: "networkgraph",
        marginTop: 20
    },
    title: {
        text: "Anycompany Artifacts"
    },
    plotOptions: {
        networkgraph: {
            keys: ["from", "to"],
            layoutAlgorithm: {
                enableSimulation: true,
                gravitationalConstant: 0.2,
                friction: -0.9
            },
            point: {
                events: {
                    click: (e) => {
                        console.log(e);
                    }
                },
            }
        }
    },
    series: [
        {
            marker: {
                radius: 10
            },
            dataLabels: {
                enabled: true,
                linkFormat: "",
                allowOverlap: true,
                verticalAlign: "bottom"
            },
            data: [
                ["78291, United Airlines", "81201, Fuselage", "Airplane"]
            ],
            nodes: [{
                id: '78291, United Airlines',
                color: '#22577A',
                marker: {radius: 20}
            }]
        }
    ]
};

const GraphSearch = () => {

    const chartComponent = useRef(null);

    const [resultItems, setResultItems] = useState([{}]);

    // useEffect(() => {
    //     updateGraph();
    // }, []);

    async function updateGraph(value) {
        const response = await API.get('searchNeptune', '/search', {
            headers: {},
            response: true,
            queryStringParameters: {
                query: value
            }
        });
        const resultItems = response.data;
        setResultItems(resultItems);

        let networkData = [];
        let networkNode = [];

        for (let i = 0; i < resultItems.length; i++) {
            //Ignore the first Result Item to create the data. But need it for nodes
            if (i !== 0) {
                const dataNode = [resultItems[0].name[0], resultItems[i].name[0]];
                networkData.push(dataNode);
            }
            let symbolUrl = null;

            if (resultItems[i].label === 'organization')
                symbolUrl = organization;
            else if (resultItems[i].label === 'location')
                symbolUrl = location;
            else if (resultItems[i].label === 'person')
                symbolUrl = person;

            const nodeNode = {
                id: resultItems[i].name[0], marker: {
                    symbol: 'url(' + symbolUrl + ')',
                }
            };
            networkNode.push(nodeNode);
        }
        console.log('resultItems is ', resultItems);
        console.log('networkNode is ', networkNode);
        options.series[0].data = networkData;
        options.series[0].nodes = networkNode;
        console.log('options is ', options);
        const chart = chartComponent.current?.chart;
        chart.redraw();
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
            <Flex direction={{base: 'row', large: 'row'}}
                  padding="1rem"
                  width="100%"
                  style={{alignItems: "center"}}
            >
                {/*<Text>{JSON.stringify(options)}</Text>*/}
                <HighchartsReact ref={chartComponent} highcharts={Highcharts} options={options} containerProps={{
                    style: {
                        height: "600px",
                        display: "block",
                        width: "70%",
                        margin: "0 auto",
                        border: "1px solid lightgray"
                    }
                }}/>
                <Flex
                    direction={{base: 'column', large: 'column'}}
                    padding="1rem"
                    width="30%"
                    height="600px"
                >
                    <Table
                        className="my-custom-table"
                        caption=""
                        cellPadding="30px"
                        highlightOnHover="true">
                        <TableBody>
                            {Object.keys(resultItems[0]).map(key => {
                                return (
                                    <TableRow key={key}>
                                        <TableCell>
                                            {key}: {resultItems[0][key]}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Flex>
            </Flex>
        </Flex>

    );
};

export default GraphSearch;