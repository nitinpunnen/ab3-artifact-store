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
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchArtifacts();
    }, []);

    useEffect(() => {
        console.log('Files', files);
    }, [files])

    async function fetchArtifacts() {
        const apiData = await API.graphql({query: listArtifacts});
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

    async function uploadFiles(event) {
        event.preventDefault();
        for (const item of files) {
            const data = {
                name: item.documentName == null? item.name : item.documentName,
                description: item.description,
                fileName: item.name,
            };
            console.log("Upload file is "+ JSON.stringify(data));
            if (!!data.fileName) await Storage.put(data.name, item.name);
            await API.graphql({
                query: createArtifactMutation,
                variables: {input: data},
            });
        }
        await fetchArtifacts();
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

    function removeFile(index) {
        console.log("Am here ", index);
        const newFiles = files.filter((item, i) => i !== index);
        setFiles(newFiles);
    }

    return (
        <Flex
            direction={{base: 'column', large: 'column'}}
            padding="1rem"
            width="90%"
            style={{display: "block", margin: "10px auto"}}
        >
            <Heading level={3} style={{textAlign: "left"}}>Upload Files</Heading>
            <View as="form" margin="3rem 0" onSubmit={uploadFiles}>
                <Flex direction="row" alignItems="center" justifyContent="center"
                      style={{width: "70%", margin: "10px auto"}}>
                    <View
                        name="fileName"
                        as="input"
                        type="file"
                        multiple
                        onChange={ (event) => {
                            const chosenFiles = Array.prototype.slice.call(event.target.files);
                            setFiles(chosenFiles);
                        }}
                    />
                    <Button type="submit" variation="primary">
                        Upload Files
                    </Button>
                </Flex>
                <Table
                    className="my-custom-table"
                    caption=""
                    cellPadding="30px"
                    highlightOnHover="true">
                    <TableHead>
                        <TableRow>
                            <TableCell as="th">File Name</TableCell>
                            <TableCell as="th">Document Name</TableCell>
                            <TableCell as="th">Description</TableCell>
                            <TableCell as="th"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.map((item, index) => {
                            return <TableRow key={index}>
                                <TableCell>
                                    {item.name}
                                </TableCell>
                                <TableCell>
                                <TextField
                                    name="name"
                                    placeholder={item.name}
                                    label="Document Name"
                                    labelHidden
                                    variation="quiet"
                                    onBlur={(e) => item.documentName = e.target.value}
                                />
                                </TableCell>
                                <TableCell>
                                <TextField
                                    name="description"
                                    placeholder="Add a short description"
                                    label="Short Description"
                                    labelHidden
                                    variation="quiet"
                                    onBlur={(e) => item.description = e.target.value}
                                    style={{width: "400px"}}
                                />
                                </TableCell>
                                <TableCell>
                                    <Button variation="link" onClick={() => removeFile(index)}>
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </View>
            <Heading level={4}>Uploaded Files</Heading>
            <View margin="3rem 0">
                <Table
                    className="my-custom-table"
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