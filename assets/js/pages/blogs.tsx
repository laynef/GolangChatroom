import * as React from 'react';
import { useMutation, useQuery } from 'react-query';
import { Button, Card, CardBody, CardHeader, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Header, Layout } from '../components/layout';
import { ClipLoader } from "react-spinners";
//@ts-ignore
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
//@ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom';
import { Editor, EditorChangeEvent, EditorTools } from "@progress/kendo-react-editor";
import { Link as A } from 'react-router-dom';
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

type Blog = {
    id: string;
    text: string;
    title: string;
    image_url: string;
}

export const BlogsPage = () => {
    const perPage = 10;
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [text, setText] = React.useState(null);
    const [html, setHtml] = React.useState('');
    const [image_url, setImageUrl] = React.useState('');
    const [lastPage, setLastPage] = React.useState(1);
    const [page, setPage] = React.useState(1);
    const [blogs, setBlogs] = React.useState([]);
    const loader = React.useRef(null);

    const { isLoading, refetch } = useQuery('blogs', async () => {
        if (page > lastPage) return null;

        try {
            const res = await fetch(`/api/v1/blogs?page=${page}&per_page=${perPage}`);
            const d = await res.json();
            
            const next = d.data || [];

            setBlogs([...blogs, ...next]);
            setLastPage(d.last_page);
            setPage(page + 1);

            return d;
        } catch (error) {
            return error;
        }
    });

    const { mutate, data: blogData }: any = useMutation('createBlogs', async (body) => {
        try {
            const res = await fetch("/api/v1/blogs", {
                method: 'POST',
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
            if (res.title) {
                setBlogs([res, ...blogs]);
                setOpen(false);
            }
        },
        onSettled: () => {
            const div = document.getElementById('scroll-container');
            div.scroll(0,0);
        }
    });

    const handleObserver = React.useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            refetch();
        }
    }, []);

    React.useEffect(() => {
        const option = {
            root: null as any,
            rootMargin: "20px",
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
    }, [handleObserver]);

    const createBlog: React.FormEventHandler = (e) => { 
        e.preventDefault(); 
        mutate({ title, text, image_url, html });
    };

    return (
        <Layout>
            <>
                <Header hasAuth />
                <main>
                    <div className='d-flex w-75 align-items-center flex-row justify-content-between'>
                        <div />
                        <h1>Blogs</h1>
                        <div className='d-flex flex-row align-items-center justify-content-center' style={{ width: 50, height: 50 }}>
                            <Button  className='rounded-circle text-white d-flex flex-column align-items-center justify-content-center' style={{ width: 35, height: 35 }} color='danger' onClick={() => setOpen(true)}>
                                &#43;
                            </Button>
                        </div>
                    </div>
                    <ScrollToBottom mode='top' behavior="smooth" className='w-75 d-flex flex-column justify-content-center p-3'>
                        <div id="scroll-container" className='scroll-container'>
                            <ClipLoader color='#dc3545' loading={isLoading} />
                            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}>
                            <Masonry>
                                {blogs.length > 0 && blogs.map((blog: Blog, key: number) => (
                                    <A className='text-dark text-decoration-none' key={key} to={`/blogs/${blog.id}`}>
                                        <Card className='w-100 blog-card'>
                                            <CardHeader className='p-0 m-0'>
                                                <img className='card-image' src={blog.image_url} alt="" />
                                            </CardHeader>
                                            <CardBody>
                                                <h4 className='blog-title'>{blog.title}</h4>
                                                <p className='blog-body'>{blog.text}</p>
                                            </CardBody>
                                        </Card>
                                    </A>
                                ))}
                            </Masonry>
                        </ResponsiveMasonry>
                        {!isLoading && blogs.length === 0 && <p className='text-center'>No blogs available</p>}
                        <div ref={loader} />
                    </div>
                    </ScrollToBottom>
                </main>
                <Modal size='md' fade backdrop isOpen={open} toggle={() => setOpen(false)}>
                    <form onSubmit={createBlog}>
                        <ModalHeader toggle={() => setOpen(false)}>
                            Create Blog
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
                                    value="Create"
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
            </>
        </Layout>
    )
};
