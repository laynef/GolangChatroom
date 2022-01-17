import { Editor, EditorChangeEvent, EditorTools } from '@progress/kendo-react-editor';
import * as React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { Button, Card, CardBody, CardHeader, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Header, Layout } from '../components/layout';
const {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Subscript,
    Superscript,
    ForeColor,
    BackColor,
    CleanFormatting,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Indent,
    Outdent,
    OrderedList,
    UnorderedList,
    Undo,
    Redo,
    FontSize,
    FontName,
    FormatBlock,
    Link,
    Unlink,
    InsertImage,
    ViewHtml,
    InsertTable,
    InsertFile,
    SelectAll,
    Print,
    Pdf,
    AddRowBefore,
    AddRowAfter,
    AddColumnBefore,
    AddColumnAfter,
    DeleteRow,
    DeleteColumn,
    DeleteTable,
    MergeCells,
    SplitCell
  } = EditorTools;

const Container: React.FC = ({ children }) => (
    <Layout>
        <>
            <Header hasAuth />
            <main>
                {children}
            </main>
        </>
    </Layout>
)

export const BlogPage = () => {
    const { id } = useParams();
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [text, setText] = React.useState('');
    const [html, setHtml] = React.useState('');
    const [image_url, setImageUrl] = React.useState('');

    const { isLoading, data } = useQuery(`blogs:${id}`, async () => {
        try {
            const res = await fetch(`/api/v1/blogs/${id}`);
            const d = await res.json();

            setTitle(d.title);
            setText(d.text);
            setHtml(d.html);
            setImageUrl(d.image_url);

            return d;
        } catch (error) {
            return error;
        }
    }, { retry: false });

    const { mutate, data: blogData }: any = useMutation('updateBlogs', async (body) => {
        try {
            const res = await fetch(`/api/v1/blogs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            return await res.json();
        } catch (error) {
            return error;
        }
    }, {
        onSuccess: (res) => {
            console.log(res);
            setOpen(false);
        }
    });

    if (isLoading) {
        <Container>
            <ClipLoader color='#dc3545' loading={isLoading} />
        </Container>
    }

    const updateBlog: React.FormEventHandler = (e) => { 
        e.preventDefault(); 
        mutate({ title, text, image_url, html });
    };

    return (
        <Container>
            <div className='d-flex w-75 align-items-center flex-row justify-content-between'>
                <div />
                <h1>{data?.title}</h1>
                <div className='d-flex flex-row align-items-center justify-content-center' style={{ width: 50, height: 50 }}>
                    <Button  className='rounded-circle text-white d-flex flex-column align-items-center justify-content-center' style={{ width: 35, height: 35 }} color='danger' onClick={() => setOpen(true)}>
                        &#x270E;
                    </Button>
                </div>
            </div>
            <Card className='w-75 card shadow'>
                <CardHeader>
                    <img className='w-100' src={data?.image_url} alt="" />
                </CardHeader>
                <CardBody>
                    <div id='scroll-container' className='scroll-container d-flex flex-column' dangerouslySetInnerHTML={{ __html: data?.html || '' }} />
                </CardBody>
            </Card>
            <Modal size='md' fade backdrop isOpen={open} toggle={() => setOpen(false)}>
                <form onSubmit={updateBlog}>
                    <ModalHeader toggle={() => setOpen(false)}>
                        Update Blog
                    </ModalHeader>
                    <ModalBody>
                        <InputGroup className='d-flex flex-column w-100'>
                            <Label>Title</Label>
                            <Input placeholder='Enter title' className='w-100' value={title} onChange={e => setTitle(e.target.value)} type='text' name='title' />
                        </InputGroup>
                        <InputGroup className='d-flex flex-column w-100'>
                            <Label>Image Url</Label>
                            <Input placeholder='Enter image url' className='w-100' value={image_url} onChange={e => setImageUrl(e.target.value)} type='text' name='image_url' />
                        </InputGroup>
                        <InputGroup className='d-flex flex-column w-100'>
                            <Label>Body</Label>
                            <Editor
                                tools={[[Bold, Italic, Underline, Strikethrough], [Subscript, Superscript], ForeColor, BackColor, [CleanFormatting], [AlignLeft, AlignCenter, AlignRight, AlignJustify], [Indent, Outdent], [OrderedList, UnorderedList], FontSize, FontName, FormatBlock, [SelectAll], [Undo, Redo], [Link, Unlink, InsertImage, ViewHtml], [InsertTable, InsertFile], [Pdf, Print], [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter], [DeleteRow, DeleteColumn, DeleteTable], [MergeCells, SplitCell]]}
                                contentStyle={{
                                    height: 200,
                                }}
                                defaultContent={''}
                                onChange={(e: EditorChangeEvent) => { setHtml(e.html); setText(e.value.textContent); }}
                                value={html}
                            />
                        </InputGroup>
                        {blogData?.code && blogData.code >= 400 && blogData.message ? (
                            <div className='column text-danger'>
                                An error occurred: {blogData.message}
                            </div>
                        ) : null}
                    </ModalBody>
                    <ModalFooter>

                    <div>
                        <Input
                            className="btn btn-danger"
                            value="Update"
                            type='submit'
                        />
                    </div>
                    {' '}
                    <Button outline onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </Container>
    )
};
