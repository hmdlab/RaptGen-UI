import axios from 'axios';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Form, Button, Table, InputGroup } from 'react-bootstrap';

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from './store';

import { setInputData } from './store-redux/input-data';
import { InputDataElement } from './store-redux/input-data';

axios.defaults.baseURL = 'http://localhost:8000/dev';

type SequenceListProps = {
    setEncodeSeqList: Dispatch<SetStateAction<InputDataElement[]>>;
    encodeSeqList: InputDataElement[];
}

type RecordProps = {
    entry: InputDataElement;
}

type EncodeResponse = {
    coord_x: number[];
    coord_y: number[];
}

const SeqenceRecord: React.FC<RecordProps> = ({ entry }) => {

    const inputData = useSelector((state: RootState) => state.inputData);
    const dispatch = useDispatch();

    const [ isEditing, setIsEditing ] = useState<boolean>(false);
    const [ seqValue, setSeqValue ] = useState<string>(entry.seq);
    const [ seqValid, setSeqValid ] = useState<boolean>(true);
    
    const onShowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newInputData = [...inputData];
        const newEncodeSeqList = newInputData.map((elem) => {
            if (elem.key === entry.key) {
                elem = {...elem};
                elem.show = e.currentTarget.checked;
            }
            return elem;
        });
        dispatch(setInputData(newEncodeSeqList));
    }
    
    const onRemove = () => {
        let newInputData = [...inputData];
        const index = newInputData.findIndex((elem) => elem.key === entry.key);
        newInputData.splice(index, 1);
        dispatch(setInputData(newInputData));
    }

    const onEdit = () => {
        setIsEditing(true);
    }

    const onEditCancel = () => {
        setSeqValue(entry.seq);
        setIsEditing(false);
    }

    const onEditSave = async () => {
        let newInputData = [...inputData];
        const index = newInputData.findIndex((elem) => elem.key === entry.key);

        const coords: EncodeResponse = await axios.post( "/sample/encode", {
            seq: [seqValue], 
            session_ID: 42
        }).then((res) => res.data);
        
        let newEntry = {
            ...inputData[index],
            seq: seqValue,
            coord_x: coords.coord_x[0],
            coord_y: coords.coord_y[0],
        }

        newInputData[index] = newEntry;

        dispatch(setInputData(newInputData));
        setIsEditing(false);
    }

    const validateSeq = (seq: string) => {
        const regex = /^[ACGTUacgtu]+$/;
        return regex.test(seq);
    }

    const onSeqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // uppercase and T to U
        const seq = e.currentTarget.value.toUpperCase().replace(/T/g, "U");
        setSeqValue(seq);
        setSeqValid(validateSeq(seq));
    }

    if (isEditing) {
        return (
            <tr key={entry.key} >
                <td><Form.Check type="checkbox" checked={entry.show} onChange={onShowChange} /></td>
                <td>{entry.id}</td>
                <td>
                    <Form.Control
                        type="text"
                        value={seqValue}
                        onChange={onSeqChange}
                        isInvalid={!seqValid}
                    />
                    <Form.Control.Feedback type="invalid">Invalid sequence</Form.Control.Feedback>
                </td>
                <td>
                    <Button variant="outline-secondary" onClick={onEditSave} disabled={!seqValid}>Save</Button>
                    <Button variant="outline-danger" onClick={onEditCancel}>Cancel</Button>
                </td>
            </tr>
        )
    } else {
        return (
            <tr key={entry.key} >
                <td><Form.Check type="checkbox" checked={entry.show} onChange={onShowChange} /></td>
                <td>{entry.id}</td>
                <td>{entry.seq}</td>
                <td>
                    <Button variant="outline-secondary" onClick={onEdit}>Edit</Button>
                    <Button variant="outline-danger" onClick={onRemove}>Remove</Button>
                </td>
            </tr>
        )
    }
}

const SequenceTable: React.FC = React.memo(() => {

    const inputData = useSelector((state: RootState) => state.inputData);
    
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Show</th>
                    <th>ID</th>
                    <th>Sequence</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {inputData.map((entry) => (
                    <SeqenceRecord
                        key={entry.key}
                        entry={entry}
                    />
                ))}
            </tbody>
        </Table>
    )
})

const SingleSequenceForm: React.FC = () => {
    const dispatch = useDispatch();
    const inputData = useSelector((state: RootState) => state.inputData);

    const [ singleSequence, setSingleSequence ] = useState<string>("");
    const [ singleSequenceValid, setSingleSequenceValid ] = useState<boolean>(true);
    const [ singleSequenceId, setSingleSequenceId ] = useState<number>(0);

    const onSingleSequenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value.toUpperCase().replace(/T/g, "U");
        setSingleSequence(value);

        const isValid: boolean = validateSeq(value);
        setSingleSequenceValid(isValid);
    }

    const validateSeq = (seq: string) => {
        const regex = /^[ACGUacgu]+$/;
        return regex.test(seq);
    }

    const onAddClick = async () => {
        try {
            const coords: EncodeResponse = await axios.post( "/sample/encode", {
                seq: [singleSequence], 
                session_ID: 42
            }).then((res) => res.data);
            
            let newInputData = [...inputData];
            newInputData.push({
                key: String(singleSequenceId),
                id: `manual_${singleSequenceId}`,
                seq: singleSequence,
                show: true,
                coord_x: coords.coord_x[0],
                coord_y: coords.coord_y[0],
                from: "manual",
                fasta_file: null,
            });
            dispatch(setInputData(newInputData));
            setSingleSequence("");
            setSingleSequenceId(singleSequenceId + 1);
        } catch {
            // alert("network error");
            alert(`Error: ${singleSequence} is not a valid sequence.`)
        }
    }

    return (
        <Form.Group className="mb-3">
            <InputGroup hasValidation>
                <Form.Control id="newSeqInput" onChange={onSingleSequenceChange} value={singleSequence} isInvalid={!singleSequenceValid}/>
                <Button
                    id="addSeqButton"
                    disabled={(singleSequence === "") || !singleSequenceValid}
                    onClick={onAddClick}
                >＋</Button>
                <Form.Control.Feedback type="invalid">Please enter a valid sequence.</Form.Control.Feedback>
            </InputGroup>
        </Form.Group>
    )
}

const FastaUploader: React.FC = () => {
    const dispatch = useDispatch();
    const inputData = useSelector((state: RootState) => state.inputData);

    const [ fastaSequences, setFastaSequences ] = useState<InputDataElement[]>([]);
    const [ fastaFeedback, setFastaFeedback ] = useState<string>("Please upload a valid fasta file.");
    const [ isFastaValid, setIsFastaValid ] = useState<boolean>(true);
    
    const onFastaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files === null) {
            setFastaSequences([]);
            setIsFastaValid(true);
            setFastaFeedback("");
            return;
        }

        const file = files[0];
        const filename = file.name;
        if (!filename.endsWith(".fasta")) {
            setFastaSequences([]);
            setIsFastaValid(false);
            setFastaFeedback("Please upload a valid fasta file.");
            return;
        }

        const content = await file.text();
        const fastaRegex = /^>\s*(\S+)[\n\r]+([ACGTUacgtu\n\r]+)$/gm;

        let match: RegExpExecArray | null;
        let matchCount = 0;
        let entries: InputDataElement[] = [];
        while (match = fastaRegex.exec(content)) {
            matchCount++;
            const id = match[1];
            const seq = match[2].replace(/[\n\r]/g, "").toUpperCase().replace(/T/g, "U");
            entries.push({
                key: `${filename}_${matchCount}`,
                id: id,
                seq: seq,
                show: true,
                coord_x: 0,
                coord_y: 0,
                from: "fasta",
                fasta_file: filename,
            })
        }

        if (matchCount === 0) {
            setFastaSequences([]);
            setIsFastaValid(false);
            setFastaFeedback("The file is invalid / does not contain any FASTA entries.");
            return;
        }

        // /dev/encode requires array which contains more than 0 entries
        // therefore matchCount (the number of valid FASTA entries) must be more than 0

        const seqs = entries.map((entry) => entry.seq);

        try {
            const coords: EncodeResponse = await axios.post( "/sample/encode", {
                seq: seqs,
                session_ID: 42
            }).then((res) => res.data);

            entries = entries.map((entry, i) => {
                return {
                    ...entry,
                    coord_x: coords.coord_x[i],
                    coord_y: coords.coord_y[i],
                }
            });

            const allCount = content.match(/^>/gm)?.length ?? 0;
            if (matchCount !== allCount) {
                setFastaFeedback(`Looks good. But the file contains ${allCount - matchCount} invalid FASTA entries.`);
            } else {
                setFastaFeedback("");
            }

            setFastaSequences(entries);
            setIsFastaValid(true);
            return;
        } catch {
            setFastaSequences([]);
            setIsFastaValid(false);
            setFastaFeedback("Network error.");
            return;
        }
    };

    useEffect(() => {
        if (fastaSequences.length > 0 && isFastaValid) {
            dispatch(setInputData(inputData.concat(fastaSequences)));
        }
    }, [fastaSequences, isFastaValid]);

    return (
        <Form.Group className="mb-3">
            <Form.Control id="newSeqFile" type="file" onChange={onFastaChange} isInvalid={!isFastaValid} isValid={(isFastaValid) && fastaSequences.length > 0}/>
            <Form.Control.Feedback type="invalid">{fastaFeedback}</Form.Control.Feedback>
            <Form.Control.Feedback type="valid">{fastaFeedback}</Form.Control.Feedback>
        </Form.Group>
    )
};

const EncodePanel: React.FC = () => {
    // const [ encodeSeqList, setEncodeSeqList ] = useState<InputDataElement[]>([]);

    // const dispatch = useDispatch();
    // const inputData = useSelector((state: any) => state.inputData.value);

    // useEffect(() => {
    //     dispatch(setInputData(encodeSeqList));
    //     console.log(inputData);
    // }, [encodeSeqList]);

    return (
        <div className="encode-panel">
            <Form.Label>Encode Sequence</Form.Label>
            <SingleSequenceForm />
            <Form.Label>Encode Fastafile</Form.Label>
            <FastaUploader />
            <Form.Label>Sequences</Form.Label>
            <SequenceTable />
        </div>
    )
};

export default EncodePanel;