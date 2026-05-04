// IE5-style browser with navigation history, favorites, and page rendering
// Provides: buildBrowserUI(args) -> HTMLElement

var BROWSER_PAGES = {
  'calcom-intranet': {
    title: 'CalCom Intranet - Home',
    url: 'http://intranet.calcom.com/',
    content: '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">' +
      '<tr>' +
        '<td colspan="2" bgcolor="#000080" style="padding: 10px 20px;">' +
          '<img src="assets/calcom/calcom_logo.png" width="120" style="vertical-align: middle; margin-right: 12px; background: white; padding: 4px;">' +
          '<font color="#FFFFFF" size="5" face="Arial"><b>CalCom</b></font><br>' +
          '<font color="#CCCCFF" size="2" face="Arial">Internal Network - Authorized Users Only</font>' +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td width="150" valign="top" bgcolor="#E8E8E8" style="padding: 10px; border-right: 1px solid #808080;">' +
          '<font size="2" face="Arial"><b>Quick Links</b></font><br>' +
          '<img src="" width="1" height="8"><br>' +
          '<font size="2" face="Arial">' +
            '&#8226; <a href="#" style="color: #0000FF;">Employee Directory</a><br>' +
            '&#8226; <a href="#" style="color: #0000FF;">Project Tracking</a><br>' +
            '&#8226; <a href="#" style="color: #0000FF;">Time Sheets</a><br>' +
            '&#8226; <a href="#" style="color: #0000FF;">IT Help Desk</a><br>' +
            '&#8226; <a href="#" style="color: #0000FF;">Benefits Info</a><br>' +
            '&#8226; <a href="#" style="color: #0000FF;">Room Reservations</a><br>' +
          '</font>' +
        '</td>' +
        '<td valign="top" style="padding: 15px;">' +
          '<font size="4" face="Arial"><b>Welcome to CalCom Intranet</b></font>' +
          '<hr size="2" noshade color="#808080">' +
          '<table width="100%" cellpadding="8" cellspacing="0">' +
            '<tr>' +
              '<td valign="top" width="60%">' +
                '<font size="2" face="Arial">' +
                  '<b>Announcements</b><br><br>' +
                  '<b>Dec 22</b> - Holiday party this Friday! Conference Room B, 14th floor 5:00 PM.<br><br>' +
                  '<b>Dec 21</b> - Y2K assessment survey -- please complete by Jan 15. Contact Margaret Sullivan.<br><br>' +
                  '<b>Dec 20</b> - Q4 survey on track: 847/1200 interviews completed.<br><br>' +
                  '<b>Dec 15</b> - New phone system training: Sign up at front desk.<br><br>' +
                '</font>' +
              '</td>' +
              '<td valign="top" bgcolor="#F5F5F5" style="border: 1px solid #C0C0C0; padding: 10px;">' +
                '<font size="2" face="Arial">' +
                  '<b>Building Info</b><br>' +
                  '<font size="1">CalCom Tower<br>Roosevelt Island, DC<br>Floors 12-15</font><br><br>' +
                  '<b>Hours</b><br>' +
                  '<font size="1">Mon-Fri: 7AM - 9PM<br>Sat: 8AM - 5PM<br>Sun: Closed</font><br><br>' +
                  '<b>IT Support</b><br>' +
                  '<font size="1">Ext. 4357 (HELP)<br>it-support@calcom.com</font>' +
                '</font>' +
              '</td>' +
            '</tr>' +
          '</table>' +
          '<hr size="1" color="#C0C0C0">' +
          '<center><font size="1" face="Arial" color="#808080">CalCom Research Services &copy; 1999 | Internal Use Only | <a href="#" style="color: #808080;">Privacy Policy</a></font></center>' +
        '</td>' +
      '</tr>' +
    '</table>'
  },

  'calcom-corporate': {
    title: 'CalCom Research Services',
    url: 'http://www.calcom.com/',
    content: '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
      '<tr><td bgcolor="#000080" style="padding: 15px 20px;">' +
        '<img src="assets/calcom/calcom_logo.png" width="120" style="vertical-align: middle; margin-right: 15px; background: white; padding: 4px;">' +
        '<font color="#FFFFFF" size="5" face="Arial"><b>CalCom</b></font>' +
        '<font color="#CCCCFF" size="2" face="Arial"> Research Services</font>' +
      '</td></tr>' +
      '<tr><td bgcolor="#000080" style="padding: 4px 20px; border-top: 1px solid #4040C0;">' +
        '<font size="2" face="Arial" color="#FFFFFF">' +
          '<a href="#" style="color: #FFFFFF;">Home</a> | ' +
          '<a href="#" style="color: #FFFFFF;">About Us</a> | ' +
          '<a href="#" style="color: #FFFFFF;">Services</a> | ' +
          '<a href="#" style="color: #FFFFFF;">Careers</a> | ' +
          '<a href="#" style="color: #FFFFFF;">Contact</a>' +
        '</font>' +
      '</td></tr>' +
      '<tr><td style="padding: 20px;">' +
        '<font size="2" face="Arial">' +
          '<center><font size="4" face="Arial"><b>Trusted Research Since 1987</b></font></center>' +
          '<br>' +
          '<table width="100%" cellpadding="10"><tr>' +
            '<td valign="top" width="50%">' +
              '<b>Who We Are</b><br><br>' +
              'CalCom Research Services is a leading provider of CATI (Computer-Assisted Telephone Interviewing) solutions for market research, public opinion polling, and consumer behavior studies.<br><br>' +
              'Founded in 1987 and headquartered on Roosevelt Island, Washington DC, we serve clients across government, healthcare, and Fortune 500 companies.' +
            '</td>' +
            '<td valign="top" width="50%" bgcolor="#F0F0F0" style="border: 1px solid #C0C0C0;">' +
              '<b>Our Services</b><br><br>' +
              '&#8226; Consumer Confidence Surveys<br>' +
              '&#8226; Public Health Research<br>' +
              '&#8226; Political Polling<br>' +
              '&#8226; Customer Satisfaction Studies<br>' +
              '&#8226; Focus Group Recruiting<br>' +
            '</td>' +
          '</tr></table>' +
          '<br>' +
          '<hr size="1" color="#C0C0C0">' +
          '<center>' +
            '<font size="1" color="#808080">' +
              '&copy; 1999 CalCom Research Services | Roosevelt Island, DC 20002 | (202) 555-0100<br>' +
              '<img src="" width="1" height="5"><br>' +
              'You are visitor number <b>12,847</b><br>' +
              '<font size="1">Best viewed in Internet Explorer 4.0 or higher at 800x600</font>' +
            '</font>' +
          '</center>' +
        '</font>' +
      '</td></tr>' +
    '</table>'
  },

  'yahoo-portal': {
    title: 'Yahoo!',
    url: 'http://www.yahoo.com/',
    content: '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
      '<tr><td bgcolor="#FFFFFF" style="padding: 5px 10px; border-bottom: 1px solid #000000;">' +
        '<table width="100%"><tr>' +
          '<td><font size="6" face="Arial" color="#FF0000"><b>Yahoo!</b></font></td>' +
          '<td align="right">' +
            '<input type="text" size="30" value="" style="border: 1px solid #808080; padding: 2px;">' +
            '<input type="submit" value="Search" style="padding: 2px 8px;">' +
          '</td>' +
        '</tr></table>' +
      '</td></tr>' +
      '<tr><td style="padding: 5px 10px; background: #FFFFCC; border-bottom: 1px solid #C0C0C0; font-size: 11px;">' +
        '<font size="1" face="Arial">' +
          '<a href="#" style="color: #0000FF;">Mail</a> - ' +
          '<a href="#" style="color: #0000FF;">My Yahoo!</a> - ' +
          '<a href="#" style="color: #0000FF;">News</a> - ' +
          '<a href="#" style="color: #0000FF;">Sports</a> - ' +
          '<a href="#" style="color: #0000FF;">Finance</a> - ' +
          '<a href="#" style="color: #0000FF;">Chat</a> - ' +
          '<a href="#" style="color: #0000FF;">Games</a> - ' +
          '<a href="#" style="color: #0000FF;">Shopping</a> - ' +
          '<a href="#" style="color: #0000FF;">GeoCities</a>' +
        '</font>' +
      '</td></tr>' +
      '<tr><td style="padding: 15px;">' +
        '<table width="100%"><tr>' +
          '<td valign="top" width="50%">' +
            '<font size="2" face="Arial">' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Arts &amp; Humanities</a></b><br>' +
              '<font size="1">Literature, Photography...</font><br><br>' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Business &amp; Economy</a></b><br>' +
              '<font size="1">Companies, Finance, Jobs...</font><br><br>' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Computers &amp; Internet</a></b><br>' +
              '<font size="1">Internet, WWW, Software...</font><br><br>' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Education</a></b><br>' +
              '<font size="1">Universities, K-12...</font><br><br>' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Entertainment</a></b><br>' +
              '<font size="1">Movies, Music, Humor...</font><br><br>' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Government</a></b><br>' +
              '<font size="1">Elections, Military, Law...</font><br><br>' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Health</a></b><br>' +
              '<font size="1">Medicine, Diseases, Drugs...</font><br>' +
            '</font>' +
          '</td>' +
          '<td valign="top" width="50%">' +
            '<font size="2" face="Arial">' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">News &amp; Media</a></b><br>' +
              '<font size="1">Newspapers, TV, Radio...</font><br><br>' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Recreation &amp; Sports</a></b><br>' +
              '<font size="1">Sports, Travel, Autos...</font><br><br>' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Reference</a></b><br>' +
              '<font size="1">Libraries, Dictionaries...</font><br><br>' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Regional</a></b><br>' +
              '<font size="1">Countries, Regions, US States...</font><br><br>' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Science</a></b><br>' +
              '<font size="1">Biology, Astronomy, Engineering...</font><br><br>' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Social Science</a></b><br>' +
              '<font size="1">Archaeology, Economics...</font><br><br>' +
              '<b>&#8226; <a href="#" style="color: #0000FF;">Society &amp; Culture</a></b><br>' +
              '<font size="1">People, Environment, Religion...</font><br>' +
            '</font>' +
          '</td>' +
        '</tr></table>' +
        '<hr size="1" color="#C0C0C0">' +
        '<center><font size="1" face="Arial" color="#808080">' +
          'Copyright &copy; 1999 Yahoo! Inc. All rights reserved.<br>' +
          '<a href="#" style="color: #808080;">Privacy Policy</a> - <a href="#" style="color: #808080;">Terms of Service</a>' +
        '</font></center>' +
        '<center style="margin-top: 4px;"><font size="1" face="Arial" color="#B0B0B0">' +
          '<a href="#" data-popup-id="publishers-clearing-center" style="color: #B0B0B0; text-decoration: none;">1</a> &middot; ' +
          '<a href="#" data-popup-id="virus-detected" style="color: #B0B0B0; text-decoration: none;">2</a> &middot; ' +
          '<a href="#" data-popup-id="shoot-the-duck" style="color: #B0B0B0; text-decoration: none;">3</a> &middot; ' +
          '<a href="#" data-popup-id="doctors-hate-her" style="color: #B0B0B0; text-decoration: none;">4</a> &middot; ' +
          '<a href="#" data-popup-id="hot-singles" style="color: #B0B0B0; text-decoration: none;">5</a> &middot; ' +
          '<a href="#" data-popup-id="napster-mp3" style="color: #B0B0B0; text-decoration: none;">6</a> &middot; ' +
          '<a href="#" data-popup-id="online-poker" style="color: #B0B0B0; text-decoration: none;">7</a> &middot; ' +
          '<a href="#" data-popup-id="donate-now" style="color: #B0B0B0; text-decoration: none;">8</a> &middot; ' +
          '<a href="#" data-popup-id="aol-free" style="color: #B0B0B0; text-decoration: none;">9</a>' +
        '</font></center>' +
      '</td></tr>' +
    '</table>'
  },

  'ask-jeeves': {
    title: 'Ask Jeeves!',
    url: 'http://www.askjeeves.com/',
    content: '<div style="width:100%;overflow:hidden;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fefecd" style="table-layout:fixed;">' +
      /* === TOP NAV BAR === */
      '<tr><td bgcolor="#660033" style="padding: 3px 10px;">' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
          '<tr>' +
            '<td>' +
              '<font size="1" face="Arial, Helvetica, sans-serif">' +
                '<a href="#" style="color:#FFFFFF;text-decoration:none;">Home</a> &#8226; ' +
                '<a href="#" style="color:#FFFFFF;text-decoration:none;">About</a> &#8226; ' +
                '<a href="#" style="color:#FFFFFF;text-decoration:none;">Help</a>' +
              '</font>' +
            '</td>' +
            '<td align="right">' +
              '<font size="1" face="Arial, Helvetica, sans-serif" color="#FFFFFF">Ask about <b>CORPORATE SERVICES</b></font>' +
            '</td>' +
          '</tr>' +
        '</table>' +
      '</td></tr>' +
      /* === MAIN BODY === */
      '<tr><td bgcolor="#fefecd">' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
          '<tr>' +
            /* --- LEFT SIDEBAR --- */
            '<td width="145" valign="top" bgcolor="#F0E8D0" style="border-right: 1px solid #D4C89E;">' +
              '<table width="145" cellpadding="0" cellspacing="0" border="0">' +
                /* May I Suggest header */
                '<tr><td bgcolor="#CC9966" style="padding: 4px 8px;">' +
                  '<font size="2" face="Arial, Helvetica, sans-serif" color="#FFFFFF"><i><b>May I Suggest:</b></i></font>' +
                '</td></tr>' +
                /* Category links */
                '<tr><td style="padding: 6px 8px; line-height: 1.6;">' +
                  '<font size="1" face="Arial, Helvetica, sans-serif">' +
                    '&#8226; <a href="#" style="color:#000080;text-decoration:none;font-weight:bold;">PERSONAL<br>&nbsp;&nbsp;Jeeves</a><br>' +
                    '&#8226; <a href="#" style="color:#000080;text-decoration:none;font-weight:bold;">ANSWER POINT</a><br>' +
                    '&#8226; <a href="#" style="color:#000080;text-decoration:none;font-weight:bold;">MONEY</a><br>' +
                    '&#8226; <a href="#" style="color:#000080;text-decoration:none;font-weight:bold;">TRAVEL</a><br>' +
                    '&#8226; <a href="#" style="color:#000080;text-decoration:none;font-weight:bold;">HEALTH</a><br>' +
                    '&#8226; <a href="#" style="color:#000080;text-decoration:none;font-weight:bold;">COMPUTERS</a><br>' +
                    '&#8226; <a href="#" style="color:#000080;text-decoration:none;font-weight:bold;">ENTERTAINMENT</a><br>' +
                    '&#8226; <a href="#" style="color:#000080;text-decoration:none;font-weight:bold;">HOME &amp; FAMILY</a><br>' +
                    '&#8226; <a href="#" style="color:#000080;text-decoration:none;font-weight:bold;">SHOPPING</a><br>' +
                    '&nbsp;&nbsp;ASK JEEVES<br>' +
                    '&nbsp;&nbsp;FOR <font color="#CC0000" size="2"><b>Kids!</b></font><br><br>' +
                    '&nbsp;&nbsp;&nbsp;<font size="1"><i>Just<br>&nbsp;&nbsp;&nbsp;Curious,<br>&nbsp;&nbsp;&nbsp;Jeeves</i></font>' +
                  '</font>' +
                '</td></tr>' +
                /* MyFamily.com ad */
                '<tr><td style="padding: 6px 8px; border-top: 1px solid #D4C89E;">' +
                  '<table width="100%" cellpadding="4" cellspacing="0" border="1" bordercolor="#336699" bgcolor="#FFFFFF">' +
                    '<tr><td align="center">' +
                      '<font size="1" face="Arial, Helvetica, sans-serif" color="#336699"><b>MyFamily.com</b></font><br>' +
                      '<font size="1" face="Arial" color="#333333">Build Your<br>Family Website<br><i>Free!</i></font>' +
                    '</td></tr>' +
                  '</table>' +
                '</td></tr>' +
              '</table>' +
            '</td>' +
            /* --- MAIN CONTENT AREA --- */
            '<td valign="top" style="padding: 8px 12px 8px 8px;">' +
              '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
                '<tr>' +
                  /* Jeeves butler image */
                  '<td width="170" valign="top" align="center" rowspan="2">' +
                    '<img src="assets/brands/ask-jeeves.webp" width="160" alt="Ask Jeeves" style="display:block;max-width:100%;">' +
                  '</td>' +
                  /* "Have a Question?" heading */
                  '<td valign="top" align="right" style="padding-left:8px;">' +
                    '<font size="1" face="Arial, Helvetica, sans-serif" color="#333333">Have a</font><br>' +
                    '<font color="#CC0000" face="Georgia, Times New Roman, serif" size="5"><b>Question?</b></font><br>' +
                    '<font size="1" face="Arial, Helvetica, sans-serif" color="#333333">Just type it in</font><br>' +
                    '<font size="1" face="Arial, Helvetica, sans-serif" color="#333333">and click </font>' +
                    '<font face="Georgia, Times New Roman, serif" size="4" color="#000080"><b>Ask!</b></font>' +
                  '</td>' +
                '</tr>' +
                '<tr>' +
                  '<td valign="top" style="padding-left:8px;padding-top:8px;">' +
                    /* Search box row */
                    '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
                      '<tr>' +
                        '<td><input type="text" size="40" value="" style="width:100%;border:2px inset #C0C0C0;padding:2px;font-size:13px;font-family:Arial,sans-serif;"></td>' +
                        '<td width="55" align="right">' +
                          '<span style="background:#CC0000;color:#FFFFFF;border-radius:12px;padding:2px 12px;font-weight:bold;font-family:Georgia,serif;font-size:14px;cursor:pointer;display:inline-block;">Ask!</span>' +
                        '</td>' +
                      '</tr>' +
                    '</table>' +
                    /* Most Recent Questions */
                    '<div style="margin-top: 12px;">' +
                      '<font size="2" face="Arial, Helvetica, sans-serif">Most Recent Questions About <b>Business</b>:</font>' +
                    '</div>' +
                    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:4px;">' +
                      '<tr>' +
                        '<td>' +
                          '<select size="3" style="width:100%;font-size:12px;font-family:Courier New,monospace;border:2px inset #C0C0C0;background:#FFFFFF;">' +
                            '<option>Where can I find a currency</option>' +
                            '<option>converter?</option>' +
                            '<option></option>' +
                          '</select>' +
                        '</td>' +
                        '<td width="55" valign="top" align="right">' +
                          '<span style="background:#CC0000;color:#FFFFFF;border-radius:12px;padding:2px 12px;font-weight:bold;font-family:Georgia,serif;font-size:14px;cursor:pointer;display:inline-block;">Ask!</span>' +
                        '</td>' +
                      '</tr>' +
                    '</table>' +
                    /* "What are people asking RIGHT NOW?" */
                    '<div style="margin-top: 10px; text-align: right;">' +
                      '<font size="2" face="Arial, Helvetica, sans-serif">What are people asking <a href="#" style="color:#CC0000;font-weight:bold;text-decoration:none;">RIGHT NOW?</a> &#8594;</font>' +
                    '</div>' +
                  '</td>' +
                '</tr>' +
              '</table>' +
            '</td>' +
          '</tr>' +
        '</table>' +
      '</td></tr>' +
      /* === GOLD FOOTER BAR === */
      '<tr><td bgcolor="#B8A040" style="padding: 5px 10px;">' +
        '<center>' +
          '<font size="1" face="Arial, Helvetica, sans-serif">' +
            '<b><a href="#" style="color:#000080;text-decoration:none;">Make Jeeves Your Homepage</a></b> &#9670; ' +
            '<b><a href="#" style="color:#000080;text-decoration:none;">Ask Jeeves U.K.</a></b> &#9670; ' +
            '<b><a href="#" style="color:#000080;text-decoration:none;">Advertise On Jeeves</a></b>' +
          '</font>' +
        '</center>' +
      '</td></tr>' +
      /* === COPYRIGHT === */
      '<tr><td style="padding: 4px 10px; text-align: center; background: #fefecd;">' +
        '<font size="1" face="Arial, Helvetica, sans-serif" color="#666666">' +
          '&copy;1996-1999 Ask Jeeves, Inc. All Rights Reserved.' +
        '</font>' +
      '</td></tr>' +
    '</table></div>'
  },

  'drudge-report': {
    title: 'DRUDGE REPORT',
    url: 'http://www.drudgereport.com/',
    content: /* === OUTER WRAPPER === */
      '<table width="600" align="center" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">' +
      /* === RED BANNER === */
      '<tr><td align="center" style="padding: 20px 0 5px 0;">' +
        '<font face="Courier New, Courier, monospace" size="7" color="#FF0000"><b>DRUDGE REPORT</b></font>' +
      '</td></tr>' +
      /* === DATE LINE === */
      '<tr><td align="center" style="padding: 2px 0 10px 0;">' +
        '<font face="Courier New, Courier, monospace" size="2">MONDAY JANUARY 24, 2000</font>' +
      '</td></tr>' +
      /* === BREAKING HEADLINE === */
      '<tr><td align="center" style="padding: 10px 0;">' +
        '<img src="assets/drudge-siren.gif" width="25" height="25"> ' +
        '<img src="assets/drudge-siren.gif" width="25" height="25"> ' +
        '<img src="assets/drudge-siren.gif" width="25" height="25"> ' +
        '<font face="Courier New, Courier, monospace" size="5" color="#FF0000"><b>D.C. DECLARES STATE OF EMERGENCY AS STORM ATLAS RAGES...</b></font> ' +
        '<img src="assets/drudge-siren.gif" width="25" height="25"> ' +
        '<img src="assets/drudge-siren.gif" width="25" height="25"> ' +
        '<img src="assets/drudge-siren.gif" width="25" height="25">' +
      '</td></tr>' +
      /* === SUB HEADLINE === */
      '<tr><td align="center" style="padding: 5px 0 10px 0;">' +
        '<font face="Courier New, Courier, monospace" size="3"><b>EXECUTIVE ORDER 13152 SIGNED AT DAWN... SUPREME COURT DELIBERATES...</b></font>' +
      '</td></tr>' +
      /* === CENTRAL PHOTO === */
      '<tr><td align="center" style="padding: 10px 0;">' +
        '<table width="320" align="center" cellpadding="0" cellspacing="0" border="1" bordercolor="#000000">' +
          '<tr><td align="center" style="padding: 0;">' +
            '<img src="assets/news/drudge-snow.jpg" width="320" alt="Storm Atlas blankets D.C." style="display:block;">' +
          '</td></tr>' +
          '<tr><td align="center" style="padding: 4px;">' +
            '<font face="Arial, sans-serif" size="1"><i>Snow blankets the Capitol as Storm Atlas dumps 12+ inches on D.C.</i></font>' +
          '</td></tr>' +
        '</table>' +
      '</td></tr>' +
      /* === SEPARATOR === */
      '<tr><td><hr size="1" noshade></td></tr>' +
      /* === THREE COLUMN LINKS === */
      '<tr><td>' +
        '<table width="100%" cellpadding="8" cellspacing="0" border="0">' +
          '<tr>' +
            '<td width="33%" valign="top">' +
              '<font face="Times New Roman, Times, serif" size="2">' +
                '<a href="#" style="color:#0000FF;">STORM ATLAS BURIES EASTERN SEABOARD...</a><br>' +
                '<a href="#" style="color:#0000FF;">FIRST HYPOTHERMIA DEATH CONFIRMED IN ROOSEVELT</a><br>' +
                '<a href="#" style="color:#0000FF;">TEMPERATURES WON&#39;T EXCEED 15 DEGREES ALL DAY</a><br>' +
                '<a href="#" style="color:#0000FF;">SNOWPLOWS STRUGGLE TO CROSS BRIDGE TO MAINLAND</a><br>' +
                '<a href="#" style="color:#0000FF;">TRAVEL RESTRICTIONS SPARK PROTESTS</a><br>' +
                '<a href="#" style="color:#0000FF;">SHELTERS OVERWHELMED ACROSS WARD</a><br>' +
                '<a href="#" style="color:#0000FF;">NWS: 12 INCHES AND CLIMBING...</a><br>' +
                '<a href="#" style="color:#0000FF;">WATER MAIN BURST LEAVES BLOCKS WITHOUT WATER</a><br>' +
                '<font size="1" color="#999999">Reuters</font><br>' +
              '</font>' +
            '</td>' +
            '<td width="33%" valign="top">' +
              '<font face="Times New Roman, Times, serif" size="2">' +
                '<a href="#" style="color:#0000FF;">$1.5M IN FEMA FUNDS VANISH... OFFICIALS REFUSE COMMENT</a><br>' +
                '<a href="#" style="color:#0000FF;">POLITICAL ACTIVISTS POINT FINGERS AT HOMELAND SECURITY</a><br>' +
                '<a href="#" style="color:#0000FF;">CALCOM HORIZON GIVES AWAY FREE PHONES... AT&amp;T BACKS OUT!</a><br>' +
                '<a href="#" style="color:#0000FF;">SINCLAIR: &#39;WE ARE STILL STANDING&#39;</a><br>' +
                '<a href="#" style="color:#0000FF;">Y2K FEARS &#39;LARGELY UNFOUNDED&#39; SAY OFFICIALS</a><br>' +
                '<a href="#" style="color:#0000FF;">SUBSTATION MALFUNCTION RATTLES RESIDENTS</a><br>' +
                '<a href="#" style="color:#0000FF;">EMERGENCY PREPAREDNESS PAMPHLETS FLOOD WARD OFFICES</a><br>' +
                '<a href="#" style="color:#0000FF;">DOW OPENS FLAT IN FIRST WEEK OF NEW MILLENNIUM</a><br>' +
                '<font size="1" color="#999999">AP Wire</font><br>' +
              '</font>' +
            '</td>' +
            '<td width="33%" valign="top">' +
              '<font face="Times New Roman, Times, serif" size="2">' +
                '<a href="#" style="color:#0000FF;">KELSEY &amp; CHELSEY SPLIT! MASS BRAWLS BETWEEN FANS</a><br>' +
                '<a href="#" style="color:#0000FF;">REMMIES SHOWDOWN: EX-DUO FORCED TO SIT TOGETHER</a><br>' +
                '<a href="#" style="color:#0000FF;">SAMMIE&#39;S CORNER STORE CLOSES AFTER 42 YEARS</a><br>' +
                '<a href="#" style="color:#0000FF;">PAYPHONE VANDALS STRIKE AGAIN... &#39;DELIBERATE AND POLITICAL&#39;</a><br>' +
                '<a href="#" style="color:#0000FF;">WORLDWIDE HOCKEY CUP DRAWS RECORD CROWDS TO D.C.</a><br>' +
                '<a href="#" style="color:#0000FF;">MAN LOSES PET FISH AT DOG PARK</a><br>' +
                '<a href="#" style="color:#0000FF;">ROMANO&#39;S SANDWICH OWNER DECLARES WAR ON &#39;BIG MAYO&#39;</a><br>' +
                '<a href="#" style="color:#0000FF;">SNOW EMERGENCY PARKING RULES IN EFFECT THROUGH WEEKEND</a><br>' +
                '<font size="1" color="#999999">UPI</font><br>' +
              '</font>' +
            '</td>' +
          '</tr>' +
        '</table>' +
      '</td></tr>' +
      /* === SEPARATOR === */
      '<tr><td><hr size="1" noshade></td></tr>' +
      /* === FOOTER === */
      '<tr><td align="center" style="padding: 10px 0;">' +
        '<font face="Courier New, Courier, monospace" size="1">' +
          '<a href="#" style="color:#0000FF;">matt@drudgereport.com</a><br><br>' +
          'DRUDGE REPORT DOES NOT OWN, OPERATE, OR MAINTAIN DRUDGEREPORT.COM<br>' +
          'IS A CONDITIONS OF USE VIOLATION TO SEND UNSOLICITED COMMERCIAL EMAIL<br>' +
          'MATERIAL CONNECTION DISCLOSURE: You should assume that this website has an affiliate relationship and/or another material connection<br>' +
          'to the persons or businesses mentioned in or linked to from this page and may receive commissions from purchases you make on subsequent web sites.<br><br>' +
          'Drudge Report &#169; 2000<br>' +
          '<font color="#999999">Visits to DRUDGE 1/13/00: 022,481,938</font>' +
        '</font>' +
      '</td></tr>' +
      '</table>'
  },

  '404': {
    title: 'The page cannot be displayed',
    url: '',
    content: '<div style="padding: 20px; font-family: Arial, sans-serif;">' +
      '<h2>The page cannot be displayed</h2>' +
      '<p>The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.</p>' +
      '<hr>' +
      '<p style="font-size: 11px;">Internet Explorer</p>' +
    '</div>'
  },

  'dns-error': {
    title: 'Cannot find server',
    url: '',
    content: '<div style="padding: 20px; font-family: Arial, sans-serif;">' +
      '<h2 style="font-weight: normal;">The page cannot be displayed</h2>' +
      '<p style="font-size: 12px;">There is a problem with the page you are trying to reach and it cannot be displayed.</p>' +
      '<hr size="1" color="#C0C0C0">' +
      '<p style="font-size: 12px;"><b>Cannot find server or DNS Error</b></p>' +
      '<p style="font-size: 11px;">Internet Explorer</p>' +
    '</div>'
  }
};

// Bookmarks cache (shared across browser instances)
var _bookmarksCache = null;

var _externalPages = {};

function buildExternalRegistry(items) {
  items.forEach(function(item) {
    if (item.mode && item.url) {
      _externalPages[item.url] = item;
    }
    if (item.children) {
      buildExternalRegistry(item.children);
    }
  });
}

function isExternalPage(key) {
  return !!_externalPages[key];
}

function getExternalPage(key) {
  return _externalPages[key];
}

function buildBrowserUI(args) {
  var container = document.createElement('div');
  container.className = 'browser-app';

  // Instance-level browser history
  var history = { stack: ['calcom-intranet'], position: 0 };

  // References to DOM elements (assigned after creation)
  var backBtn, fwdBtn, addressInput, contentArea, favoritesPanel, statusBar;
  var throbber, throbberTimer = null;

  // ---- Popup Ad System ----
  var POPUP_TRIGGER_PAGES = ['yahoo-portal', 'drudge-report'];
  var POPUP_DELAY_MS = 3000;
  var popupState = {
    triggeredPages: {},    // Object used as set -- keys are page keys that already fired
    pendingTimer: null,    // Active setTimeout ID for cleanup
    adsRegistry: null      // Loaded from popup-ads.json
  };

  function checkPopupTrigger(pageKey) {
    // Clear any pending timer from previous navigation
    if (popupState.pendingTimer) {
      clearTimeout(popupState.pendingTimer);
      popupState.pendingTimer = null;
    }
    // Only trigger on whitelisted pages
    if (POPUP_TRIGGER_PAGES.indexOf(pageKey) === -1) return;
    // Only trigger once per session per page
    if (popupState.triggeredPages[pageKey]) return;

    popupState.triggeredPages[pageKey] = true;
    popupState.pendingTimer = setTimeout(function() {
      popupState.pendingTimer = null;
      spawnPopupAd();
    }, POPUP_DELAY_MS);
  }

  function spawnPopupAd(adId) {
    if (!popupState.adsRegistry || popupState.adsRegistry.length === 0) return;

    var ad;
    if (adId) {
      // Manual trigger: look up by id, bypass random selection and session lock
      for (var i = 0; i < popupState.adsRegistry.length; i++) {
        if (popupState.adsRegistry[i].id === adId) {
          ad = popupState.adsRegistry[i];
          break;
        }
      }
      if (!ad) {
        console.warn('Popup ad id not found:', adId);
        return;
      }
    } else {
      // Auto trigger: random selection from available ads
      ad = popupState.adsRegistry[Math.floor(Math.random() * popupState.adsRegistry.length)];
    }

    // Play spawn sound
    if (ad.sound) {
      SoundManager.play(ad.sound);
    }

    // Save currently active window for pop-under restoration
    var previousActiveId = WindowManager.activeWindowId;

    // Fetch the ad HTML snippet
    fetch('content/popups/' + ad.file)
      .then(function(r) { return r.text(); })
      .then(function(html) {
        // Random position within desktop bounds
        var maxX = Math.max(0, window.innerWidth - ad.width - 20);
        var maxY = Math.max(0, window.innerHeight - 28 - ad.height - 20);
        var randX = Math.floor(Math.random() * maxX);
        var randY = Math.floor(Math.random() * maxY);

        WindowManager.createWindow({
          title: ad.titleBar,
          width: ad.width,
          height: ad.height,
          content: html,
          icon: '<img src="assets/icons/16/iexplore.png" width="16" height="16">',
          maximizable: false,
          minimizable: false,
          resizable: false,
          statusBar: false,
          position: { x: randX, y: randY }
        });

        // Explicit zOrder handling. JSON enum: "popup" | "pop-under".
        if (ad.zOrder === 'popup') {
          // Default behavior: the newly created window already has focus
          // from WindowManager.createWindow above. Nothing to do.
        } else if (ad.zOrder === 'pop-under' && previousActiveId) {
          // Pop-under: restore focus to the previously active window
          WindowManager.focusWindow(previousActiveId);
        } else if (ad.zOrder !== 'popup' && ad.zOrder !== 'pop-under') {
          console.warn('Unknown popup ad zOrder:', ad.zOrder);
        }
      })
      .catch(function(err) {
        console.warn('Failed to load popup ad:', err);
      });
  }

  // ---- Navigation functions ----

  function startThrobber() {
    if (throbber) throbber.classList.add('loading');
    if (statusBar) statusBar.textContent = 'Opening page...';
  }

  function stopThrobber() {
    if (throbber) throbber.classList.remove('loading');
    if (throbberTimer) {
      clearTimeout(throbberTimer);
      throbberTimer = null;
    }
    if (statusBar) statusBar.textContent = 'Done';
  }

  function showLinkOutDialog(ext) {
    SoundManager.play('ding');
    var overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.innerHTML =
      '<div class="nt4-dialog" style="width: 380px;">' +
        '<div class="dialog-titlebar">Microsoft Internet Explorer</div>' +
        '<div class="dialog-body" style="display: flex; align-items: center; gap: 12px;">' +
          '<img src="assets/icons/32/iexplore.png" width="32" height="32" style="image-rendering: pixelated;">' +
          '<span>This link will open in your web browser.<br><br>Continue?</span>' +
        '</div>' +
        '<div class="dialog-buttons">' +
          '<button class="nt4-btn ok-btn" style="min-width: 75px;">OK</button>' +
          '<button class="nt4-btn cancel-btn" style="min-width: 75px;">Cancel</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.ok-btn').addEventListener('click', function() {
      window.open(ext.src, '_blank');
      overlay.remove();
    });
    overlay.querySelector('.cancel-btn').addEventListener('click', function() {
      overlay.remove();
    });
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
  }

  function renderPage(pageKey) {
    // Clear any existing iframe
    var existingIframe = contentArea.querySelector('iframe');
    if (existingIframe) existingIframe.remove();
    stopThrobber();

    if (isExternalPage(pageKey)) {
      var ext = getExternalPage(pageKey);
      if (ext.mode === 'iframe') {
        contentArea.innerHTML = '';
        var iframe = document.createElement('iframe');
        iframe.src = ext.src;
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
        contentArea.appendChild(iframe);
        addressInput.value = ext.displayUrl;
        startThrobber();
        iframe.addEventListener('load', function() { stopThrobber(); });
        throbberTimer = setTimeout(function() {
          if (throbber && throbber.classList.contains('loading')) {
            stopThrobber();
            contentArea.innerHTML = '';
            var errPage = BROWSER_PAGES['dns-error'];
            contentArea.innerHTML = errPage.content;
          }
        }, 15000);
      } else {
        // linkout -- should not reach here via renderPage (handled in navigateTo)
        // but as a safety fallback, show the dialog
        showLinkOutDialog(ext);
        return;
      }
    } else {
      var page = BROWSER_PAGES[pageKey] || BROWSER_PAGES['dns-error'];
      contentArea.innerHTML = page.content;
      addressInput.value = page.url;
    }

    // Update window title
    var windowEl = container.closest('.nt4-window');
    if (windowEl) {
      var titleEl = windowEl.querySelector('.titlebar-title');
      if (titleEl) {
        var title;
        if (isExternalPage(pageKey)) {
          title = getExternalPage(pageKey).name;
        } else {
          title = (BROWSER_PAGES[pageKey] || BROWSER_PAGES['dns-error']).title;
        }
        titleEl.textContent = title + ' - Microsoft Internet Explorer';
      }
    }
  }

  function navigateTo(pageKey) {
    // Check for link-out before adding to history
    if (isExternalPage(pageKey)) {
      var ext = getExternalPage(pageKey);
      if (ext.mode === 'linkout') {
        showLinkOutDialog(ext);
        return; // Do NOT add to history
      }
    }
    // Truncate forward history
    history.stack = history.stack.slice(0, history.position + 1);
    history.stack.push(pageKey);
    history.position = history.stack.length - 1;
    renderPage(pageKey);
    updateNavButtons();
    checkPopupTrigger(pageKey);
  }

  function goBack() {
    if (history.position > 0) {
      history.position--;
      renderPage(history.stack[history.position]);
      updateNavButtons();
    }
  }

  function goForward() {
    if (history.position < history.stack.length - 1) {
      history.position++;
      renderPage(history.stack[history.position]);
      updateNavButtons();
    }
  }

  function updateNavButtons() {
    backBtn.disabled = history.position <= 0;
    fwdBtn.disabled = history.position >= history.stack.length - 1;
    backBtn.style.opacity = backBtn.disabled ? '0.5' : '1';
    fwdBtn.style.opacity = fwdBtn.disabled ? '0.5' : '1';
  }

  function resolveUrl(typed) {
    typed = typed.trim();
    if (!typed) return null;
    var lower = typed.toLowerCase();
    // Search BROWSER_PAGES for matching url
    var keys = Object.keys(BROWSER_PAGES);
    for (var i = 0; i < keys.length; i++) {
      var page = BROWSER_PAGES[keys[i]];
      if (page.url && page.url.toLowerCase() === lower) {
        return keys[i];
      }
    }
    // Also try matching directly as a page key
    if (BROWSER_PAGES[lower]) return lower;
    // Check external pages by displayUrl
    var extKeys = Object.keys(_externalPages);
    for (var j = 0; j < extKeys.length; j++) {
      var ext = _externalPages[extKeys[j]];
      if (ext.displayUrl && ext.displayUrl.toLowerCase() === lower) return extKeys[j];
    }
    return null;
  }

  // ---- Menu bar ----

  var menuBar = document.createElement('div');
  menuBar.className = 'app-menubar';
  ['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].forEach(function(label) {
    var item = document.createElement('div');
    item.className = 'menu-item';
    item.textContent = label;
    menuBar.appendChild(item);
  });
  container.appendChild(menuBar);

  // ---- Toolbar ----

  var toolbar = document.createElement('div');
  toolbar.className = 'app-toolbar raised browser-toolbar';

  backBtn = document.createElement('button');
  backBtn.className = 'toolbar-btn raised';
  backBtn.textContent = 'Back';
  backBtn.disabled = true;
  backBtn.style.opacity = '0.5';
  backBtn.addEventListener('click', goBack);
  toolbar.appendChild(backBtn);

  fwdBtn = document.createElement('button');
  fwdBtn.className = 'toolbar-btn raised';
  fwdBtn.textContent = 'Fwd';
  fwdBtn.disabled = true;
  fwdBtn.style.opacity = '0.5';
  fwdBtn.addEventListener('click', goForward);
  toolbar.appendChild(fwdBtn);

  var sep1 = document.createElement('div');
  sep1.className = 'toolbar-separator';
  toolbar.appendChild(sep1);

  var stopBtn = document.createElement('button');
  stopBtn.className = 'toolbar-btn raised';
  stopBtn.textContent = 'X';
  stopBtn.addEventListener('click', function() {
    var iframe = contentArea.querySelector('iframe');
    if (iframe) {
      iframe.src = 'about:blank';
    }
    stopThrobber();
  });
  toolbar.appendChild(stopBtn);

  var refreshBtn = document.createElement('button');
  refreshBtn.className = 'toolbar-btn raised';
  refreshBtn.textContent = 'R';
  refreshBtn.addEventListener('click', function() {
    var currentKey = history.stack[history.position];
    renderPage(currentKey);
  });
  toolbar.appendChild(refreshBtn);

  var homeBtn = document.createElement('button');
  homeBtn.className = 'toolbar-btn raised';
  homeBtn.textContent = 'H';
  homeBtn.addEventListener('click', function() {
    navigateTo('calcom-intranet');
  });
  toolbar.appendChild(homeBtn);

  var sep2 = document.createElement('div');
  sep2.className = 'toolbar-separator';
  toolbar.appendChild(sep2);

  var favToggleBtn = document.createElement('button');
  favToggleBtn.className = 'toolbar-btn raised';
  favToggleBtn.textContent = 'Fav';
  favToggleBtn.addEventListener('click', function() {
    if (favoritesPanel.style.display === 'none') {
      favoritesPanel.style.display = '';
    } else {
      favoritesPanel.style.display = 'none';
    }
  });
  toolbar.appendChild(favToggleBtn);

  throbber = document.createElement('div');
  throbber.className = 'browser-throbber';
  toolbar.appendChild(throbber);

  container.appendChild(toolbar);

  // ---- Address bar ----

  var addressBar = document.createElement('div');
  addressBar.className = 'browser-address-bar';

  var addressLabel = document.createElement('span');
  addressLabel.className = 'address-label';
  addressLabel.textContent = 'Address';
  addressBar.appendChild(addressLabel);

  addressInput = document.createElement('input');
  addressInput.className = 'nt4-input';
  addressInput.type = 'text';
  addressInput.style.fontSize = '11px';
  addressInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var key = resolveUrl(addressInput.value);
      if (key) {
        navigateTo(key);
      } else {
        navigateTo('dns-error');
      }
    }
  });
  addressBar.appendChild(addressInput);

  var goBtn = document.createElement('button');
  goBtn.className = 'nt4-button';
  goBtn.textContent = 'Go';
  goBtn.addEventListener('click', function() {
    var key = resolveUrl(addressInput.value);
    if (key) {
      navigateTo(key);
    } else {
      navigateTo('dns-error');
    }
  });
  addressBar.appendChild(goBtn);

  container.appendChild(addressBar);

  // ---- Body (favorites + content) ----

  var body = document.createElement('div');
  body.className = 'browser-body';

  // Favorites sidebar
  favoritesPanel = document.createElement('div');
  favoritesPanel.className = 'browser-favorites sunken';

  var favHeader = document.createElement('div');
  favHeader.className = 'browser-favorites-header';
  var favTitle = document.createElement('span');
  favTitle.textContent = 'Favorites';
  favHeader.appendChild(favTitle);
  var favCloseBtn = document.createElement('button');
  favCloseBtn.className = 'close-btn';
  favCloseBtn.textContent = 'x';
  favCloseBtn.addEventListener('click', function() {
    favoritesPanel.style.display = 'none';
  });
  favHeader.appendChild(favCloseBtn);
  favoritesPanel.appendChild(favHeader);

  var favList = document.createElement('div');
  favList.className = 'browser-favorites-list';
  favoritesPanel.appendChild(favList);

  body.appendChild(favoritesPanel);

  // Content area
  contentArea = document.createElement('div');
  contentArea.className = 'browser-content sunken';

  // Prevent link clicks from navigating away
  contentArea.addEventListener('click', function(e) {
    var anchor = e.target.closest ? e.target.closest('a') : null;
    if (!anchor) {
      // Fallback for older browsers
      var node = e.target;
      while (node && node !== contentArea) {
        if (node.tagName === 'A') { anchor = node; break; }
        node = node.parentNode;
      }
    }
    if (anchor) {
      e.preventDefault();
      var popupId = anchor.getAttribute('data-popup-id');
      if (popupId) {
        spawnPopupAd(popupId);
      }
    }
  });

  body.appendChild(contentArea);
  container.appendChild(body);

  // ---- Status bar ----

  statusBar = document.createElement('div');
  statusBar.className = 'well';
  statusBar.textContent = 'Done';
  statusBar.style.padding = '2px 4px';
  statusBar.style.fontSize = '11px';
  container.appendChild(statusBar);

  // ---- Load bookmarks ----

  function renderBookmarks(items, parentEl, depth) {
    items.forEach(function(item) {
      if (item.children) {
        // Folder
        var folderEl = document.createElement('div');
        var folderRow = document.createElement('div');
        folderRow.className = 'browser-bookmark-item';
        folderRow.style.paddingLeft = (4 + depth * 16) + 'px';
        folderRow.innerHTML = iconImg('folder_closed', 16) + ' ' + item.name;

        var childContainer = document.createElement('div');
        childContainer.style.display = 'none';

        var expanded = false;
        folderRow.addEventListener('click', function() {
          expanded = !expanded;
          childContainer.style.display = expanded ? '' : 'none';
          folderRow.innerHTML = iconImg(expanded ? 'folder_open' : 'folder_closed', 16) + ' ' + item.name;
        });

        folderEl.appendChild(folderRow);
        folderEl.appendChild(childContainer);
        renderBookmarks(item.children, childContainer, depth + 1);
        parentEl.appendChild(folderEl);
      } else if (item.url) {
        // Bookmark
        var bookmarkEl = document.createElement('div');
        bookmarkEl.className = 'browser-bookmark-item';
        bookmarkEl.style.paddingLeft = (4 + depth * 16) + 'px';
        bookmarkEl.innerHTML = iconImg('iexplore', 16) + ' ' + item.name;
        bookmarkEl.addEventListener('click', function() {
          navigateTo(item.url);
        });
        parentEl.appendChild(bookmarkEl);
      }
    });
  }

  function loadBookmarks() {
    if (_bookmarksCache) {
      buildExternalRegistry(_bookmarksCache.items);
      renderBookmarks(_bookmarksCache.items, favList, 0);
      return;
    }
    fetch('content/bookmarks.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        _bookmarksCache = data;
        buildExternalRegistry(data.items);
        renderBookmarks(data.items, favList, 0);
      })
      .catch(function(err) {
        console.warn('Failed to load bookmarks:', err);
      });
  }

  loadBookmarks();

  // Load popup ads registry
  fetch('content/popup-ads.json')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      popupState.adsRegistry = data;
    })
    .catch(function(err) {
      console.warn('Failed to load popup ads:', err);
    });

  // ---- Render initial page ----
  // Use setTimeout so the DOM is attached first (needed for closest('.nt4-window'))
  setTimeout(function() {
    renderPage('calcom-intranet');
  }, 0);

  return container;
}
