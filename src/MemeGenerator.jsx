import { useEffect, useState, useRef } from 'react'
import { Stack, FormControl, InputLabel, Select, MenuItem, Container, Box, Typography, Button } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios'
import Draggable from 'react-draggable'
import domtoimage from 'dom-to-image'


export default function MemeGenerator() {
    const [memes, setMemes] = useState([])
    const [selectedMeme, setSelectedMeme] = useState('')
    const memeContainerRef = useRef(null)
    const [uploadedImage, setUploadedImage] = useState(null)
    const [isCustomImageSelected, setIsCustomImageSelected] = useState(false);
    const [draggableComponents, setDraggableComponents] = useState([])
    const [isEditing, setIsEditing] = useState(false); // Track edit mode
    const [selectedColor, setSelectedColor] = useState('white')
    const [selectedSize, setSelectedSize] = useState('70px')
    const [selectedFont, setSelectedFont] = useState('Impact')

    const colorOptions = [
        { value: 'white', label: 'White' },
        { value: 'black', label: 'Black' },
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
        { value: 'yellow', label: 'Yellow' }
    ]

    const sizeOptions = [
        { value: '40px', label: '40px' },
        { value: '50px', label: '50px' },
        { value: '60px', label: '60px' },
        { value: '70px', label: '70px' },
        { value: '80px', label: '80px' },
        { value: '90px', label: '90px' },
    ]

    const fontOptions = [
        { value: 'Impact', label: 'Impact' },
        { value: 'Arial', label: 'Arial' },
        { value: 'Comic Sans MS', label: 'Comic Sans MS' },
        { value: 'Myriad Pro', label: 'Myriad Pro' },
        { value: 'Helvetica', label: 'Helvetica' },
    ]
   
    useEffect(() => {
        axios
            .get('https://api.memegen.link/templates')
            .then((response) => {
                console.log(response.data)
                const template = response.data || []
                setMemes(template)
                const randomIndex = Math.floor(Math.random() * template.length)
                setSelectedMeme(template[randomIndex].id)
            })
            .catch((err) => console.log(err))
    }, [])

    // template dropdown
    const handleMemeChange = (e) => {
        const selectedMemeId = e.target.value
        setSelectedMeme(selectedMemeId)
        setIsCustomImageSelected(false)
    }

    // text color dropdown
    const renderColorOptions = colorOptions.map((colorOption) => (
        <MenuItem key={colorOption.value} value={colorOption.value}>
            {colorOption.label}
        </MenuItem>
    ))
    
    const handleColorChange = (color) => {
        setSelectedColor(color)
    }

    // text size dropdown
    const renderSizeOptions = sizeOptions.map((sizeOption) => (
        <MenuItem key={sizeOption.value} value={sizeOption.value}>
            {sizeOption.label}
        </MenuItem>
    ))

    const handleSizeChange = (size) => {
        setSelectedSize(size)
    }

    // font dropdown
    const renderFontOptions = fontOptions.map((fontOption) => (
        <MenuItem key={fontOption.value} value={fontOption.value}>
            {fontOption.label}
        </MenuItem>
    ))

    const handleFontChange = (font) => {
        setSelectedFont(font)
    }

    // upload image button
    const handleUploadImage = (e) => {
        const file = e.target.files[0]
        setUploadedImage(file)
        setIsCustomImageSelected(true);
    }

    // add text button
    const createDraggableComponent = () => {
        const newComponent = (
            <Draggable key={draggableComponents.length}>
                <p 
                    className={`draggable ${isEditing ? 'editing' : ''}`}
                    contentEditable={isEditing}
                    onClick={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                    style={{ color: selectedColor, fontSize: selectedSize, fontFamily: selectedFont }}
                >
                    EDIT & DRAG ME
                </p>
            </Draggable>
        );
        setDraggableComponents(prevComponents => [...prevComponents, newComponent]);
    };

    // download button
    const handleSaveMeme = () => {
        if (memeContainerRef.current) {
            domtoimage.toBlob(memeContainerRef.current)
            .then((blob) => {
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = 'meme.png'
                link.click()
            })
        }
    }

    // share button
    const handleShareMeme = () => {
        if (navigator.share && memeContainerRef.current) {
            domtoimage.toBlob(memeContainerRef.current)
            .then((blob) => {
                const filesArray = [new File([blob], 'meme.png', { type: 'image/png' })];

                // Use the Web Share API to share the image
                navigator.share({
                    files: filesArray,
                })
                .then(() => {
                // Sharing succeeded
                console.log('Meme shared successfully');
                })
                .catch((error) => {
                // Sharing failed
                console.error('Error sharing meme:', error);
                });
            });
        }
    };
    
    return (
        <Container maxWidth='md'>

            <Typography variant='h3' mt={4} mb={4}>MEME GENERATOR 💬</Typography>

            <Stack direction='row' spacing={2} mb={2}>
                <FormControl>
                    <InputLabel>Template</InputLabel>
                    <Select 
                        label='template' 
                        size='small' 
                        value={selectedMeme} 
                        onChange={handleMemeChange}>
                        {memes && memes.map((meme) => (
                            <MenuItem key={meme.id} value={meme.id}>
                                {meme.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant='h6' mb={2}>or</Typography>

                <Button variant='contained' component='label'>File
                    <input 
                        type='file' 
                        accept='image/*' 
                        onChange={handleUploadImage} 
                        style={{ display: 'none'}} 
                    />
                </Button>
            </Stack>
            
            <Stack direction='row' spacing={2} mb={2}>
                <FormControl>
                    <InputLabel>Font</InputLabel>
                    <Select 
                        size='small' 
                        label='font' 
                        value={selectedFont} 
                        onChange={(e) => handleFontChange(e.target.value)}
                    >
                        {renderFontOptions}
                    </Select>
                </FormControl>

                <FormControl>
                    <InputLabel>Color</InputLabel>
                    <Select 
                        size='small' 
                        label='color' 
                        value={selectedColor} 
                        onChange={(e) => handleColorChange(e.target.value)}
                    >
                        {renderColorOptions}
                    </Select>
                </FormControl>

                <FormControl>
                    <InputLabel>Size</InputLabel>
                    <Select 
                        size='small' 
                        label='size' 
                        value={selectedSize} 
                        onChange={(e) => handleSizeChange(e.target.value)}
                    >
                        {renderSizeOptions}
                    </Select>
                </FormControl>
                <Button variant='contained' onClick={createDraggableComponent}>add text</Button>
            </Stack>
                       
            <Box ref={memeContainerRef} mb={2}>
                {selectedMeme && (
                    <Box position='relative' overflow='hidden'>
                        {isCustomImageSelected && uploadedImage ? (
                            <img src={URL.createObjectURL(uploadedImage)} alt="Uploaded Meme" style={{ maxWidth: '100%', display: 'block' }} />
                            ) : (
                            <img src={`https://api.memegen.link/images/${selectedMeme}.png`} alt="Meme" style={{ maxWidth: '100%', display: 'block' }} />
                        )}

                        <Box position='absolute' top='30%' left='4%' transform='translate(-50%, -50%)'>
                        {draggableComponents.map(component => component)}
                            <Draggable>
                                <p 
                                    className='draggable' 
                                    contentEditable='true'
                                    style={{ color: selectedColor, fontSize: selectedSize, fontFamily: selectedFont }} 
                                >
                                    EDIT & DRAG ME
                                </p>
                            </Draggable>
                        </Box>
                    </Box>
                )}
            </Box>

            <Stack direction='row' spacing={2} mb={6}>
                <DownloadIcon 
                    fontSize='large' 
                    onClick={handleSaveMeme} 
                    style={{ cursor: 'pointer' }} 
                />
                <ShareIcon 
                    fontSize='large' 
                    onClick={handleShareMeme} 
                    style={{ cursor: 'pointer' }} 
                />
            </Stack>

        </Container>
    )
}


// draggable text not working on mobile
// share button
// refactor into components?

// https://learn.wbscodingschool.com/lessons/%f0%9f%9b%a0%ef%b8%8f-react-meme-generator/

// css image?? https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_image_text, https://www.w3schools.com/css/css_positioning.asp


// responsiveness & style, https://mui-treasury.com/styles/button/
