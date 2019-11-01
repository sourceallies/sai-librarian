import React, { useState } from 'react';
import shortId from 'shortid';
import downloadFile from 'js-file-download';

function buildLabelRow() {
    const id = shortId.generate();
    return [
        id,
        `${window.location.origin}/books/${id}`
    ].join(',');
}

function buildCsv(count) {
    return Array(count)
        .fill(null)
        .map(buildLabelRow)
        .join('\n');
}

export default function GenerateLabelFile() {
    const [labelCount, setLabelCount] = useState(30);

    function onSubmit(e) {
        e.preventDefault();
        const csvContent = buildCsv(parseInt(labelCount));
        downloadFile(csvContent, 'library-labels.csv', 'text/csv');
    }

    function onLabelCountChange(event) {
        setLabelCount(event.target.value);
    }

    return (
        <form onSubmit={onSubmit}>
            <label>
                Number of Labels
                <input
                    type="number"
                    value={labelCount}
                    onChange={onLabelCountChange} />
            </label>
            <button type='submit'>Download</button>
        </form>
    );
}