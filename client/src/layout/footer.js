import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// import { blue } from '@mui/material/colors'


/* --------[ The anatomy of a website ]---------

 . “About Us” and “Contact Us” pages. Users will want to know who you are and what your company or brand is about.
 . Many people lose business cards and will return to your website to retrieve that contact information.



Why we need footer ?
  . User can immediately scroll down, if page has no loader it seams empty, so static footer content indicate page still loading.
  . to maintain visitor engagement, secondary site navigation is a must-have footer item (even if it duplicates your header menu).
  . To put all links on every page (of course in footer section) make your site more SEO friendly,

      CTA (Call To Action)
        - means when user comes to footer (by scrolling) then give him some task to do, like:
            . Include a box to sign up for an e-newsletter or
            . invite them to follow you on a social media channel.

    . Include a Call to Action
    . Include a Copyright Notice
    . Include Basic Contact Information
    . Link to Your Information
    . Make content section by section
    . Use Plenty of Space in Footer.
    . Maintain Your Design Theme.
         . for colors with high contrast, such as a light background with black text or dark background with white text.
         . Avoid using varying colors or ornate typefaces.
    . Consider a Sub-Footer, (Single line like navbar, put social media links to right & copy right on it )
    . Don’t Underline All Those Links:



What is 'copyright notice', 'disclaimers'

*/


const backgroundColor = '#113b51'
const color = '#ffffff'
const colorHeading = '#fbfcfc'


const Footer = () => {

  return (
    <Box sx={{ backgroundColor, color: '#ccc' }} >
      <Typography component='footer' variant='body2' sx={{py: 4, px: 2, }} >
  			Footer
      </Typography>

      <Typography component='footer' variant='body2' align='center' sx={{p: 1, backgroundColor: '#073148ff'}} >
        copy right &copy;2020
      </Typography>
    </Box>
  )
}

export default Footer
