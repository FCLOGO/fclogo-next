import WeiboIcon from '../components/_icons/Weibo';
import XIcon from '../components/_icons/X';
import InstagramIcon from '../components/_icons/Instagram';
import FacebookIcon from '../components/_icons/Facebook';
import DiscordIcon from '../components/_icons/Discord';

export const siteConfig = {
  name: 'FCLOGO',
  baseUrl: 'https://fclogo.top',
  socialLinks: [
    { name: 'Weibo', href: 'https://weibo.com/7578670869', Icon: WeiboIcon },
    { name: 'X', href: 'https://twitter.com/fclogotop', Icon: XIcon },
    { name: 'Instagram', href: 'https://www.instagram.com/fclogo_top/', Icon: InstagramIcon },
    { name: 'Facebook', href: 'https://www.facebook.com/fclogo.top/', Icon: FacebookIcon },
    { name: 'Discord', href: 'https://discord.gg/gVcbysaEWD', Icon: DiscordIcon },
  ],
} as const;