import React from 'react';
import './SearchDocuments.css';
import {Flex, Heading, SearchField} from "@aws-amplify/ui-react";
import {API} from "aws-amplify";

const SearchDocuments = () => {

    async function searchDocument(value) {
        const response = await API.get('searchKendra', '/search', {
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
            <Heading level={4} style={{textAlign: "left"}}>Document Search</Heading>
            <Flex direction={{base: 'row', large: 'row'}}
                  padding="1rem"
                  width="50%"
                  style={{alignItems: "center", margin: "auto", display: "block"}}
            >
                <SearchField
                    label="Search"
                    placeholder="Search for Documents..."
                    size={"large"}
                    onSubmit={(value) => searchDocument(value)}
                />
            </Flex>
        </Flex>
    );
};
export default SearchDocuments;