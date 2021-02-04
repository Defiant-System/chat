<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="teams">
	<xsl:for-each select="./Team">
		<xsl:sort order="ascending" select="@cstamp"/>
		<div class="team">
			<xsl:attribute name="title"><xsl:value-of select="@name"/></xsl:attribute>
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:if test="not(@img)">
				<xsl:attribute name="data-name"><xsl:value-of select="@short"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="@img">
				<xsl:attribute name="style">
					background-image: url(<xsl:value-of select="@img"/>);
					background-color: transparent;
				</xsl:attribute>
			</xsl:if>
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
		<xsl:for-each select="//Friends/*">
			<!-- <xsl:sort order="descending" select="@online"/> -->
			<xsl:sort order="ascending" select="@name"/>
			<xsl:variable name="channelId" select="concat( $teamId, '-', $me, '-', @id )"/>

			<li class="friend" data-click="select-channel">
				<xsl:attribute name="data-id"><xsl:value-of select="$teamId"/>/<xsl:value-of select="@id"/></xsl:attribute>
				<xsl:if test="@online = 1">
					<xsl:attribute name="class">friend online</xsl:attribute>
				</xsl:if>
				<i class="icon-offline"></i>
				<div class="name">
					<xsl:value-of select="@name"/>
					<xsl:if test="@me = 'true'"><span>(you)</span></xsl:if>
				</div>
				<xsl:if test="count(//Transcripts/*[@id = $channelId]/*[@unread]) &gt; 0">
					<span class="notification"><xsl:value-of select="count(//Transcripts/*[@id = $channelId]/*[@unread])"/></span>
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
			<xsl:variable name="channelId" select="concat( $teamId, '-', $me, '-', @id )"/>
			
			<li class="channel" data-click="select-channel">
				<xsl:attribute name="data-id"><xsl:value-of select="$teamId"/>/<xsl:value-of select="@id"/></xsl:attribute>
				<i class="icon-thread"></i>
				<div class="name">
					<xsl:value-of select="@name"/>
				</div>
				<xsl:if test="count(//Transcripts/*[@id = $channelId]/*[@unread]) &gt; 0">
					<span class="notification"><xsl:value-of select="count(//Transcripts/*[@id = $channelId]/*[@unread])"/></span>
				</xsl:if>
			</li>
		</xsl:for-each>
		<li class="add-channel" data-click="add-channel">
			<i class="icon-plus"></i>Add a channel
		</li>
	</ul></div>
</xsl:template>

<xsl:template name="members">
	<xsl:param name="teamId" />
	<xsl:variable name="me" select="//Friends/*[@me = 'true']/@id"/>
	<h2 data-click="toggle-members"><i class="icon-chevron-left"></i>Members</h2>

	<div class="members-list"><ul>
		<xsl:for-each select="./*">
			<xsl:sort order="ascending" select="//Friends/i[@id = current()/@id]/@name"/>
			<xsl:variable name="user" select="//Friends/i[@id = current()/@id]"/>
			<xsl:variable name="channelId" select="concat( $teamId, '-', $me, '-', $user/@id )"/>
			<li class="member" data-click="select-channel">
				<xsl:attribute name="data-id"><xsl:value-of select="$teamId"/>/<xsl:value-of select="@id"/></xsl:attribute>
				<xsl:if test="$user/@online = 1">
					<xsl:attribute name="class">member online</xsl:attribute>
				</xsl:if>
				<i class="icon-offline"></i>
				<div class="name">
					<xsl:value-of select="$user/@name"/>
				</div>
				<xsl:if test="count(//Transcripts/*[@id = $channelId]/*[@unread]) &gt; 0">
					<span class="notification"><xsl:value-of select="count(//Transcripts/*[@id = $channelId]/*[@unread])"/></span>
				</xsl:if>
			</li>
		</xsl:for-each>
		<li class="add-member" data-click="add-member">
			<i class="icon-plus"></i>Invite people
		</li>
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
				<xsl:attribute name="data-name"><xsl:value-of select="$user/@short"/></xsl:attribute>
			</div>
			<div class="date"><xsl:value-of select="@timestamp"/></div>
			<xsl:value-of select="." disable-output-escaping="yes"/>
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
			<xsl:if test="@online = 1">
				<xsl:attribute name="class">profile online</xsl:attribute>
			</xsl:if>
			<div class="avatar">
				<xsl:if test="@avatar">
					<xsl:attribute name="style">background-image: url(<xsl:value-of select="@avatar"/>);</xsl:attribute>
				</xsl:if>
			</div>
			<h2>
				<i class="icon-offline"></i>
				<xsl:value-of select="@name"/>
			</h2>
			<div class="action-options">
				<div class="action">
					<i class="icon-phone"></i>
				</div>
				<div class="action">
					<i class="icon-camera"></i>
				</div>
			</div>
		</div>

		<div class="field">
			<span>Nickname</span>
			<span><xsl:value-of select="@id"/></span>
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