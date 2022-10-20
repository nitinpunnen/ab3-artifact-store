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
import {listNotes} from "../../graphql/queries";
import {
    createNote as createNoteMutation,
    deleteNote as deleteNoteMutation,
} from "../../graphql/mutations"

const UploadFiles = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetchNotes();
    }, []);

    async function fetchNotes() {
        const apiData = await API.graphql({query: listNotes});
        console.log(apiData);
        const notesFromAPI = apiData.data.listNotes.items;
        await Promise.all(
            notesFromAPI.map(async (note) => {
                if (note.image) {
                    const url = await Storage.get(note.name);
                    console.log("Got the url ", url)
                    note.fileUrl = url;
                }
                return note;
            })
        );
        setNotes(notesFromAPI);
    }

    async function uploadFile(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const image = form.get("image");
        const data = {
            name: form.get("name"),
            description: form.get("description"),
            image: image.name,
        };
        if (!!data.image) await Storage.put(data.name, image);
        await API.graphql({
            query: createNoteMutation,
            variables: {input: data},
        });
        fetchNotes();
        event.target.reset();
    }

    async function deleteNote({id, name}) {
        const newNotes = notes.filter((note) => note.id !== id);
        setNotes(newNotes);
        await Storage.remove(name);
        await API.graphql({
            query: deleteNoteMutation,
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
                        name="image"
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
                        {notes.map((note) => (
                            <TableRow key={note.id || note.name}>
                                <TableCell>
                                    {note.name}
                                </TableCell>
                                <TableCell>{note.description}</TableCell>
                                <TableCell>{note.createdAt}</TableCell>
                                <TableCell><a href={note.fileUrl}>{note.image}</a></TableCell>
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