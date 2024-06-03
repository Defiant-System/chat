<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="teams">
	<xsl:for-each select="./Team">
		<xsl:sort order="ascending" select="@cstamp"/>
		<div class="team all-read">
			<xsl:attribute name="title"><xsl:value-of select="@name"/></xsl:attribute>
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:if test="not(@img)">
				<xsl:attribute name="data-name"><xsl:value-of select="@short"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="@img">
				<xsl:attribute name="style">
					background-image: url(<xsl:value-of select="@img"/>);
				</xsl:attribute>
			</xsl:if>
			<span class="notification"></span>
		</div>
	</xsl:for-each>
</xsl:template>

<xsl:template name="threads">
	<xsl:variable name="teamId" select="@id"/>

	<xsl:if test="@id = 'friends'">
		<div class="friends">
			<xsl:call-template name="friends">
				<xsl:with-param name="teamId" select="$teamId" />
			</xsl:call-template>
		</div>
	</xsl:if>

	<xsl:for-each select="./*">
		<xsl:choose>
			<xsl:when test="name() = 'Channels'">
				<div class="channels">
					<xsl:call-template name="channels">
						<xsl:with-param name="teamId" select="$teamId" />
					</xsl:call-template>
				</div>
			</xsl:when>
			<xsl:when test="name() = 'Members'">
				<div class="members">
					<xsl:call-template name="members">
						<xsl:with-param name="teamId" select="$teamId" />
					</xsl:call-template>
				</div>
			</xsl:when>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>

<xsl:template name="friends">
	<xsl:param name="teamId" />
	<xsl:variable name="me" select="//Friends/*[@me = 'true']/@id"/>
	<h2>Friends</h2>

	<div class="friends-list"><ul>
		<xsl:for-each select="//Teams/Team[@id = 'friends']/*">
			<!-- <xsl:sort order="descending" select="@online"/> -->
			<xsl:sort order="ascending" select="@name"/>

			<li class="friend" data-click="select-thread">
				<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
				<xsl:attribute name="data-username"><xsl:value-of select="@username"/></xsl:attribute>
				<xsl:if test="@online = 1">
					<xsl:attribute name="class">friend online</xsl:attribute>
				</xsl:if>
				<i class="icon-offline"></i>
				<div class="name">
					<xsl:value-of select="@name"/>
					<xsl:if test="@me = 'true'"><span>(you)</span></xsl:if>
				</div>
				<xsl:if test="count(//Transcripts/*[@id = current()/@id]/*[@unread]) &gt; 0">
					<span class="notification"><xsl:value-of select="count(//Transcripts/*[@id = current()/@id]/*[@unread])"/></span>
				</xsl:if>
			</li>
		</xsl:for-each>
		<li class="add-friend" data-click="add-friend">
			<i class="icon-plus"></i>Add Friend(s)
		</li>
	</ul></div>
</xsl:template>

<xsl:template name="channels">
	<xsl:param name="teamId" />
	<xsl:variable name="me" select="//Friends/*[@me = 'true']/@id"/>
	<h2 data-click="toggle-channels"><i class="icon-chevron-left"></i>Channels</h2>
	
	<div class="channels-list"><ul>
		<xsl:for-each select="./*">
			<xsl:sort order="ascending" select="@cstamp"/>
			<xsl:variable name="channelId" select="current()/@id"/>
			
			<li class="channel" data-click="select-thread">
				<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
				<i class="icon-thread"></i>
				<div class="name">
					<xsl:value-of select="@name"/>
				</div>
				<xsl:if test="count(//Transcripts/*[@id = $channelId]/*[@unread]) &gt; 0">
					<span class="notification"><xsl:value-of select="count(//Transcripts/*[@id = $channelId]/*[@unread])"/></span>
				</xsl:if>
			</li>
		</xsl:for-each>
		<!-- <li class="add-channel disabled" data-click="add-channel">
			<i class="icon-plus"></i>Add channel
		</li> -->
	</ul></div>
</xsl:template>

<xsl:template name="members">
	<xsl:param name="teamId" />
	<xsl:variable name="me" select="//Friends/*[@me = 'true']/@id"/>
	<h2 data-click="toggle-members"><i class="icon-chevron-left"></i>Members</h2>

	<div class="members-list"><ul>
		<xsl:for-each select="./*">
			<xsl:sort order="ascending" select="@username"/>
			<li class="member" data-click="select-thread">
				<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
				<i class="icon-online"></i>
				<div class="name">
					<xsl:value-of select="@username"/>
					<xsl:if test="@username = $me"><span>(you)</span></xsl:if>
				</div>
				<xsl:if test="count(//Transcripts/*[@id = current()/@id]/*[@unread]) &gt; 0">
					<span class="notification"><xsl:value-of select="count(//Transcripts/*[@id = current()/@id]/*[@unread])"/></span>
				</xsl:if>
			</li>
		</xsl:for-each>
		<!-- <li class="add-member disabled" data-click="add-member">
			<i class="icon-plus"></i>Invite people
		</li> -->
	</ul></div>
</xsl:template>

<xsl:template name="empty-channel">
	<div class="initial-message">
		<i class="icon-info"></i> There is no previous message in this channel / room. 
		Type in a first message now.
	</div>
</xsl:template>

<xsl:template name="transcripts">
	<xsl:if test="count(./*) = 0">
		<xsl:call-template name="empty-channel" />
	</xsl:if>
	<xsl:for-each select="./*">
		<xsl:sort order="ascending" select="@cstamp"/>
		<xsl:call-template name="message"/>
	</xsl:for-each>
</xsl:template>

<xsl:template name="msg-transmit">
	<xsl:variable name="file" select="./file"/>
	<xsl:variable name="me" select="//Friends/*[@me = 'true']/@id"/>

	<div class="file-transmit" data-module="file">
		<xsl:attribute name="data-id"><xsl:value-of select="$file/@id"/></xsl:attribute>
		<xsl:choose>
			<xsl:when test="$file/@status = 'inquiry' and @from = $me">
				<div class="transmit-inquiry">
					Sending File <u><xsl:value-of select="$file/@name"/></u>
					<i><xsl:call-template name="sys:file-size">
						<xsl:with-param name="bytes" select="$file/@size" />
					</xsl:call-template></i>
				</div>
				<div class="transmit-options">
					<span class="btn-cancel" data-click="cancel-send">Cancel</span>
				</div>
			</xsl:when>
			<xsl:when test="$file/@status = 'inquiry' and @from != $me">
				<div class="transmit-inquiry">
					Sending File <u><xsl:value-of select="$file/@name"/></u>
					<i><xsl:call-template name="sys:file-size">
						<xsl:with-param name="bytes" select="$file/@size" />
					</xsl:call-template></i>
				</div>
				<div class="transmit-options">
					<span class="btn-accept" data-click="accept-file">Accept</span>
					<span class="btn-reject" data-click="reject-file">Reject</span>
				</div>
			</xsl:when>
			<xsl:when test="$file/@status = 'cancel'">
				<div class="transmit-canceled">
					<i class="icon-warning"></i> File Canceled
				</div>
			</xsl:when>
			<xsl:when test="$file/@status = 'reject'">
				<div class="transmit-rejected">
					<i class="icon-warning"></i> File Rejected
				</div>
			</xsl:when>
			<xsl:when test="$file/@status = 'abort'">
				<div class="transmit-rejected">
					<i class="icon-warning"></i> Transmission Aborted
				</div>
			</xsl:when>
			<xsl:when test="$file/@status = 'done' and @from = $me">
				<div class="transmit-received">
					<i class="icon-info"></i> File Sent <u><xsl:value-of select="$file/@name"/></u>
				</div>
			</xsl:when>
			<xsl:when test="$file/@status = 'done' and @from != $me">
				<div class="transmit-received">
					<i class="icon-info"></i> File Received <u><xsl:value-of select="$file/@name"/></u>
				</div>
			</xsl:when>
			<xsl:when test="$file/@status = 'accept'">
				<div class="transmit-left">
					<i class="icon-folder"></i>
				</div>
				<div class="transmit-body" styl1e="--perc: 37%; --sent: '137 KB'; --total: '2.1 MB'; --time: '2.3 minutes';">
					<div class="transmit-info">
						<xsl:if test="@from = $me">Sending</xsl:if>
						<xsl:if test="@from != $me">Receiving</xsl:if>
						<u><xsl:value-of select="$file/@name"/></u>
					</div>
					<div class="transmit-progress">
						<span></span>
					</div>
					<div class="transmit-details">
						<span class="f-sent"></span>
						<span class="f-tot"></span>
						<span class="f-time"></span>
						<!-- 137 KB of 2.1 MB - 3 minutes -->
					</div>
				</div>
				<div class="transmit-right">
					<span class="btn-abort" data-click="abort-file"></span>
				</div>
			</xsl:when>
		</xsl:choose>
	</div>
</xsl:template>

<xsl:template name="msg-board">
	<div class="board" data-module="board">
		<canvas width="360" height="220" data-no-focus="1"></canvas>
		<ul class="palette" data-click="select-color">
			<li style="--color: #000;"></li>
			<li style="--color: #f00;"></li>
			<li style="--color: #0f0;" class="active"></li>
			<li style="--color: #00f;"></li>
			<li style="--color: #ff0;"></li>
			<li style="--color: #f0f;"></li>
			<li style="--color: #f90;"></li>
			<li style="--color: #0ff;"></li>
			<li style="--color: #369;"></li>
			<li style="--color: #fff;"></li>
		</ul>
	</div>
</xsl:template>

<xsl:template name="message">
	<xsl:variable name="me" select="//Settings/User"/>
	<xsl:variable name="user" select="//Friends/i[@id = current()/@from]"/>
	<div>
		<xsl:attribute name="class">message <xsl:choose>
			<xsl:when test="@from = $me/@id">sent</xsl:when>
			<xsl:otherwise>received</xsl:otherwise>
		</xsl:choose></xsl:attribute>
		<div class="msg-wrapper">
			<div class="avatar">
				<xsl:attribute name="data-name">
					<xsl:value-of select="$user/@short"/>
					<xsl:if test="not(//Friends/i[@id = current()/@from])"><xsl:value-of select="substring( @from, 1, 2 )"/></xsl:if>
				</xsl:attribute>
			</div>
			<div class="date"><xsl:value-of select="@timestamp"/></div>
			<xsl:choose>
				<xsl:when test="@type = 'board'">
					<xsl:call-template name="msg-board"/>
				</xsl:when>
				<xsl:when test="@type = 'file'">
					<xsl:call-template name="msg-transmit"/>
				</xsl:when>
				<xsl:otherwise><xsl:value-of select="." disable-output-escaping="yes"/></xsl:otherwise>
			</xsl:choose>
		</div>
	</div>
</xsl:template>

<xsl:template name="user-initials">
	<xsl:param name="user" />
	<xsl:value-of select="substring( $user/@name, 1, 1 )" />
	<xsl:value-of select="substring( substring-after( $user/@name, ' ' ), 1, 1 )" />
</xsl:template>

<xsl:template name="typing">
	<div class="message received typing">
		<div class="msg-wrapper">
			<div class="avatar" data-name="placeholder"></div>
			<i class="anim-typing"><b></b><b></b><b></b></i>
		</div>
	</div>
</xsl:template>

<xsl:template name="tiny-typing">
	<i class="anim-typing tiny"><b></b><b></b><b></b></i>
</xsl:template>

<xsl:template name="info">
	<div class="info-body">
		<div class="profile">
			<xsl:attribute name="data-username"><xsl:value-of select="@username"/></xsl:attribute>
			<xsl:if test="@online = 1">
				<xsl:attribute name="class">profile online</xsl:attribute>
			</xsl:if>
			<div class="avatar">
				<xsl:if test="@avatar">
					<xsl:attribute name="style">background-image: url(/res/avatar/<xsl:value-of select="@username"/>.jpg);</xsl:attribute>
				</xsl:if>
			</div>
			<h2>
				<i class="icon-offline"></i>
				<xsl:value-of select="@name"/>
			</h2>
			<xsl:if test="not(@me)">
				<div class="action-options">
					<div class="action" data-click="camera-call-user">
						<xsl:if test="@online != 1"><xsl:attribute name="class">action disabled</xsl:attribute></xsl:if>
						<i class="icon-camera"></i>
					</div>
					<div class="action" data-click="voice-call-user">
						<xsl:if test="@online != 1"><xsl:attribute name="class">action disabled</xsl:attribute></xsl:if>
						<i class="icon-phone"></i>
					</div>
				</div>
			</xsl:if>
		</div>

		<div class="field">
			<span>Nickname</span>
			<span><xsl:value-of select="@username"/></span>
		</div>

		<xsl:if test="@mobile">
			<div class="field">
				<span>Phone</span>
				<span><xsl:value-of select="@mobile"/></span>
			</div>
		</xsl:if>
	</div>
</xsl:template>

</xsl:stylesheet>