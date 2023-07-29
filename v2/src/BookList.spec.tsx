import { render, screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import { mockClient } from "aws-sdk-client-mock";
import BookList from "./BookList";
import { it, expect, beforeEach } from "vitest";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const mockDynamoDbClient = mockClient(DynamoDBClient);

beforeEach(() => {
    mockDynamoDbClient.reset();
});

function setupScanResponse() {
    import.meta.env.VITE_BOOK_TABLE = 'books';
    mockDynamoDbClient.on(ScanCommand, { TableName: "books" }).resolvesOnce({
        Items: [
            {
                bookId: { S: 'abc123' },
                title: { S: 'A Great Project' },
                isbn: { S: '0201634554' },
                shelf: { S: 'Alpha' },
                checkedOutBy: { NULL: true }
            },
            {
                bookId: { S: 'xyz987' },
                title: { S: 'No Image Book' },
                isbn: { S: '00011122' },
                shelf: { S: 'Alpha' },
                checkedOutBy: { S: "John Doe" }
            }
        ],
        LastEvaluatedKey: { foo: { S: 'bar' } }
    });
    mockDynamoDbClient.on(ScanCommand, { TableName: "books", ExclusiveStartKey: { foo: { S: 'bar' } } }).resolvesOnce({
        Items: [
            {
                bookId: { S: 'def456' },
                title: { S: 'The Senior Software Engineer' },
                isbn: { S: '12323124' },
                shelf: { S: 'Alpha' },
                checkedOutBy: { NULL: true }
            }
        ]
    })
}

it("Should load and show the books", async () => {
    setupScanResponse();

    render(<BookList />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).not.toBeNull();

    await waitForElementToBeRemoved(progressBar);

    const firstBookItem = within(screen.getByRole("listitem", { name: "A Great Project" }));
    expect(firstBookItem.getByText("A Great Project")).not.toBeNull();
    const firstBookImage = firstBookItem.getByRole("img");
    expect(firstBookImage).toHaveAttribute('alt', 'Cover for A Great Project');
    expect(firstBookImage).toHaveAttribute('src', 'https://example.org/a-great-project.png');
});