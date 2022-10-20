import React, {useState, useEffect} from "react";
import "./UploadFiles.css";
import "@aws-amplify/ui-react/styles.css";
import {API, Storage} from 'aws-amplify';
import {
    Button,
    Flex,
    Heading,
    Table, TableBody, TableCell, TableHead, TableRow,
    TextField,
    View,
} from '@aws-amplify/ui-react';
import {listArtifacts} from "../../graphql/queries";
import {
    createArtifact as createArtifactMutation,
    deleteArtifact as deleteArtifactMutation,
} from "../../graphql/mutations"

const UploadFiles = () => {
    const [artifacts, setArtifacts] = useState([]);

    useEffect(() => {
        fetchArtifacts();
    }, []);

    async function fetchArtifacts() {
        const apiData = await API.graphql({query: listArtifacts});
        console.log("Fetch Artifacts ", apiData);
        const notesFromAPI = apiData.data.listArtifacts.items;
        await Promise.all(
            notesFromAPI.map(async (note) => {
                if (note.fileName) {
                    const url = await Storage.get(note.name);
                    console.log("Got the url ", url)
                    note.fileUrl = url;
                }
                return note;
            })
        );
        setArtifacts(notesFromAPI);
    }

    async function uploadFile(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const fileName = form.get("fileName");
        const data = {
            name: form.get("name"),
            description: form.get("description"),
            fileName: fileName.name,
        };
        console.log("Upload file is ", data);
        if (!!data.fileName) await Storage.put(data.name, fileName);
        await API.graphql({
            query: createArtifactMutation,
            variables: {input: data},
        });
        fetchArtifacts();
        event.target.reset();
    }

    async function deleteNote({id, name}) {
        const newNotes = artifacts.filter((note) => note.id !== id);
        setArtifacts(newNotes);
        await Storage.remove(name);
        await API.graphql({
            query: deleteArtifactMutation,
            variables: {input: {id}},
        });
    }

    return (
        <Flex
            direction={{base: 'column', large: 'column'}}
            padding="1rem"
            width="90%"
            style={{display: "block", margin: "10px auto"}}
        >
            <Heading level={3} style={{textAlign: "left"}}>Upload Files</Heading>
            <View as="form" margin="3rem 0" onSubmit={uploadFile}>
                <Flex direction="row" justifyContent="left" style={{width: "70%"}}>
                    <TextField
                        name="name"
                        placeholder="Document Name"
                        label="Document Name"
                        labelHidden
                        variation="quiet"
                        required
                    />
                    <TextField
                        name="description"
                        placeholder="Add a short description"
                        label="Short Description"
                        labelHidden
                        variation="quiet"
                        required
                        style={{width: "400px"}}
                    />
                    <View
                        name="fileName"
                        as="input"
                        type="file"
                        style={{alignSelf: "end"}}
                    />
                    <Button type="submit" variation="primary">
                        Upload File
                    </Button>
                </Flex>
            </View>
            <Heading level={4}>Uploaded Files</Heading>
            <View margin="3rem 0">
                <Table
                    caption=""
                    cellPadding="30px"
                    highlightOnHover="true">
                    <TableHead>
                        <TableRow>
                            <TableCell as="th">Name</TableCell>
                            <TableCell as="th">Description</TableCell>
                            <TableCell as="th">Created At</TableCell>
                            <TableCell as="th">File Name</TableCell>
                            <TableCell as="th">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {artifacts.map((note) => (
                            <TableRow key={note.id || note.name}>
                                <TableCell>
                                    {note.name}
                                </TableCell>
                                <TableCell>{note.description}</TableCell>
                                <TableCell>{note.createdAt}</TableCell>
                                <TableCell><a href={note.fileUrl}>{note.fileName}</a></TableCell>
                                <TableCell>
                                    <Button variation="link" onClick={() => deleteNote(note)}>
                                        Delete note
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </View>
        </Flex>
    );
};

export default UploadFiles;